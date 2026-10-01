// P2P Chat and Presence Widget via Gun.js
// AoT-PNASF - Kolay ve Hatasız Widget Sistemi

document.addEventListener('DOMContentLoaded', () => {
  // Gun.js başlatılıyor (Güvenilir ve hızlı public relay sunucuları)
  const gun = Gun(['https://gun-manhattan.herokuapp.com/gun', 'https://peer.wallie.io/gun']);
  
  // Veritabanı referansları
  const chatNode = gun.get('aot-pnasf-chat-v2');
  const presenceNode = gun.get('aot-pnasf-presence-v2');
  const randomId = length => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, byte => byte.toString(36)).join('').slice(0, length);
  };
  const myId = randomId(8);
  
  // HTML Elementleri
  const chatWindow = document.getElementById('chatWindow');
  const chatToggleBtn = document.getElementById('chatToggleBtn');
  const chatMinimizeBtn = document.getElementById('chatMinimizeBtn');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatNicknameSetup = document.getElementById('chatNicknameSetup');
  const chatInputArea = document.getElementById('chatInputArea');
  const chatNicknameInput = document.getElementById('chatNicknameInput');
  const chatSetNicknameBtn = document.getElementById('chatSetNicknameBtn');
  const chatRandomNick = document.getElementById('chatRandomNick');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatUserNick = document.getElementById('chatUserNick');
  const chatUnreadBadge = document.getElementById('chatUnreadBadge');
  const chatOnlineCount = document.getElementById('chatOnlineCount');
  
  // Üst menü çevrimiçi sayaç elementleri
  const headerOnlineCount = document.getElementById('onlineUsersCount');
  const modalOnlineCount = document.getElementById('modalOnlineCount');

  // Ana sayfadaki hafif chat markup'ı tam panel markup'ı olmadan da çalışmalı.
  const hasFullChatUI = [
    chatWindow, chatToggleBtn, chatMessages, chatInput, chatSendBtn,
    chatMinimizeBtn, chatCloseBtn, chatNicknameSetup, chatInputArea,
    chatNicknameInput, chatSetNicknameBtn, chatRandomNick, chatUserNick
  ].every(Boolean);
  if (!hasFullChatUI) {
    let simpleOpen = false;
    chatToggleBtn?.addEventListener('click', () => {
      simpleOpen = !simpleOpen;
      chatWindow?.classList.toggle('hidden', !simpleOpen);
      if (simpleOpen && chatInput) chatInput.focus();
    });
    const sendSimpleMessage = () => {
      const text = chatInput?.value.trim();
      if (!text || !chatMessages) return;
      const row = document.createElement('div');
      row.className = 'text-xs text-gray-300 py-1';
      row.textContent = text;
      chatMessages.appendChild(row);
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };
    chatSendBtn?.addEventListener('click', sendSimpleMessage);
    chatInput?.addEventListener('keydown', event => {
      if (event.key === 'Enter') sendSimpleMessage();
    });
    return;
  }
  
  let myNickname = localStorage.getItem('aot-chat-nick') || '';
  let isChatOpen = false;
  let unreadCount = 0;
  let isFirstLoad = true;
  
  // Online oyuncuları takip etmek için yerel obje
  const onlinePlayers = {};

  // --- UI KONTROLLERİ ---
  function updateUI() {
    if (myNickname) {
      chatNicknameSetup.classList.add('hidden');
      chatInputArea.classList.remove('hidden');
      chatUserNick.textContent = myNickname + ':';
    } else {
      chatNicknameSetup.classList.remove('hidden');
      chatInputArea.classList.add('hidden');
    }
  }

  chatToggleBtn.addEventListener('click', () => {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
      chatWindow.classList.remove('hidden');
      unreadCount = 0;
      chatUnreadBadge.classList.add('hidden');
      chatUnreadBadge.textContent = '0';
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
      chatWindow.classList.add('hidden');
    }
  });

  chatMinimizeBtn.addEventListener('click', () => {
    isChatOpen = false;
    chatWindow.classList.add('hidden');
  });

  chatCloseBtn.addEventListener('click', () => {
    isChatOpen = false;
    chatWindow.classList.add('hidden');
  });

  // --- RUMUZ SİSTEMİ ---
  function setNickname(nick) {
    if (!nick || nick.trim().length < 3) return alert('En az 3 karakterli bir rumuz girin!');
    myNickname = nick.trim().substring(0, 16);
    localStorage.setItem('aot-chat-nick', myNickname);
    updateUI();
    // Rumuz güncellendiğinde presence bilgisini de güncelle
    sendHeartbeat();
  }

  chatSetNicknameBtn.addEventListener('click', () => setNickname(chatNicknameInput.value));
  chatNicknameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') setNickname(chatNicknameInput.value);
  });

  chatRandomNick.addEventListener('click', () => {
    const adjs = ['Hızlı', 'Korkusuz', 'Gölge', 'Usta', 'Zengin', 'Yırtıcı'];
    const nouns = ['Savaşçı', 'Avcı', 'Tüccar', 'Büyücü', 'Okçu', 'Hırsız'];
    const r = () => Math.floor(Math.random() * 6);
    setNickname(`${adjs[r()]} ${nouns[r()]}${Math.floor(Math.random() * 99)}`);
  });

  // --- MESAJLAŞMA SİSTEMİ ---
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || !myNickname) return;
    
    // Mesajı Gun.js'e gönder
    const msg = {
      nick: myNickname,
      text: text,
      time: Date.now(),
      id: randomId(10)
    };
    
    chatNode.get(msg.id).put(msg);
    chatInput.value = '';
    
    // Kendi mesajımızı hemen göster
    renderMessage(msg);
  }

  chatSendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Mesajları Dinle
  let renderedMessages = new Set();
  chatNode.map().on((msg, id) => {
    if (!msg || !msg.text || renderedMessages.has(id)) return;
    
    // Sadece son 1 saatteki mesajları göster
    if (Date.now() - msg.time > 3600000) return;
    
    // Kendi mesajımız sendMessage içinde işlendiği için atla
    if (msg.nick === myNickname && Date.now() - msg.time < 5000) return;
    
    renderedMessages.add(id);
    renderMessage(msg);
    
    // Bildirim sesi ve rozet
    if (!isChatOpen && !isFirstLoad) {
      unreadCount++;
      chatUnreadBadge.textContent = unreadCount > 99 ? '99+' : unreadCount;
      chatUnreadBadge.classList.remove('hidden');
      
      // Animasyon ekle
      chatToggleBtn.classList.add('animate-bounce');
      setTimeout(() => chatToggleBtn.classList.remove('animate-bounce'), 1000);
    }
  });

  function renderMessage(msg) {
    const isMe = msg.nick === myNickname;
    const timeStr = new Date(msg.time).toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'});
    
    const div = document.createElement('div');
    div.className = `flex flex-col mb-2 ${isMe ? 'items-end' : 'items-start'}`;
    
    div.innerHTML = `
      <div class="flex items-baseline gap-2 mb-1">
        <span class="text-[10px] text-gray-500">${timeStr}</span>
        <span class="text-xs font-bold ${isMe ? 'text-albion-accent' : 'text-gray-300'}">${msg.nick}</span>
      </div>
      <div class="px-3 py-2 rounded-lg text-sm max-w-[85%] break-words ${
        isMe ? 'bg-albion-700 text-white rounded-br-none' : 'bg-albion-900 border border-albion-700 text-gray-200 rounded-bl-none'
      }">
        ${escapeHTML(msg.text)}
      </div>
    `;
    
    chatMessages.appendChild(div);
    if (isChatOpen || isMe) {
        setTimeout(() => chatMessages.scrollTop = chatMessages.scrollHeight, 50);
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag])
    );
  }

  // --- OYUNCU SAYISI (PRESENCE) SİSTEMİ ---
  function sendHeartbeat() {
    presenceNode.get(myId).put({
        time: Date.now(),
        nick: myNickname || 'Misafir'
    });
  }
  
  // Diğer oyuncuların varlık sinyallerini dinle
  presenceNode.map().on((data, key) => {
      if (data && data.time) {
          onlinePlayers[key] = data;
          updateOnlineCounters();
      }
  });
  
  function updateOnlineCounters() {
    let count = 0;
    const now = Date.now();
    const activeThreshold = 45000; // 45 saniyeden eski sinyaller pasif sayılır
    
    for (const key in onlinePlayers) {
        if (now - onlinePlayers[key].time < activeThreshold) {
            count++;
        }
    }
    
    // En az 1 kişi (kendimiz) her zaman aktif görünmeli
    const finalCount = Math.max(1, count);
    
    // UI Güncellemeleri
    if (chatOnlineCount) chatOnlineCount.textContent = `(${finalCount})`;
    if (headerOnlineCount) headerOnlineCount.textContent = finalCount;
    if (modalOnlineCount) modalOnlineCount.textContent = `(${finalCount})`;
    
    // Liste modalını güncelleme kısmı varsa burada tetiklenebilir
    const onlineUsersList = document.getElementById('onlineUsersList');
    if (onlineUsersList && document.getElementById('onlineUsersModal') && !document.getElementById('onlineUsersModal').classList.contains('hidden')) {
        renderOnlineUsersList();
    }
  }
  
  function renderOnlineUsersList() {
      const onlineUsersList = document.getElementById('onlineUsersList');
      if (!onlineUsersList) return;
      
      const now = Date.now();
      let html = '';
      
      for (const key in onlinePlayers) {
          if (now - onlinePlayers[key].time < 45000) {
              const nick = onlinePlayers[key].nick || 'Misafir';
              const isMe = key === myId;
              html += `
                <div class="flex items-center justify-between bg-albion-900 border border-albion-700 p-2 rounded-lg">
                    <div class="flex items-center gap-2">
                        <span class="h-2 w-2 rounded-full bg-green-500"></span>
                        <span class="text-white font-bold text-sm ${isMe ? 'text-albion-accent' : ''}">${nick} ${isMe ? '(Sen)' : ''}</span>
                    </div>
                    <span class="text-[10px] text-gray-500">Aktif</span>
                </div>
              `;
          }
      }
      
      onlineUsersList.innerHTML = html || '<p class="text-center text-gray-500 text-sm">Yalnızsınız...</p>';
  }

  // Modal event listeners (Modalı açma)
  const onlineBadge = document.getElementById('onlineUsersBadge');
  const onlineModal = document.getElementById('onlineUsersModal');
  const closeOnlineModal = document.getElementById('closeOnlineUsersModal');
  
  if (onlineBadge && onlineModal) {
      onlineBadge.addEventListener('click', () => {
          onlineModal.classList.remove('hidden');
          onlineModal.classList.add('flex');
          renderOnlineUsersList();
      });
  }
  
  if (closeOnlineModal && onlineModal) {
      closeOnlineModal.addEventListener('click', () => {
          onlineModal.classList.add('hidden');
          onlineModal.classList.remove('flex');
      });
  }

  // Başlangıç işlemleri
  updateUI();
  sendHeartbeat();
  updateOnlineCounters(); // İlk gösterim
  
  // Döngüler
  setInterval(sendHeartbeat, 15000); // Her 15sn'de bir varlık bildir
  setInterval(updateOnlineCounters, 5000); // Her 5 saniyede bir eskiyen kayıtları temizleyip sayacı güncelle

  setTimeout(() => { isFirstLoad = false; }, 3000);
});