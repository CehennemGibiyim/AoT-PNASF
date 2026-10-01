// P2P Chat and Presence Widget via Gun.js
// AoT-PNASF - Sosyal İletişim Modülü (AdBlocker'lara takılmamak için isim değiştirildi)

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Gun === 'undefined') {
    console.error('Gun.js yüklenemedi!');
    return;
  }

  // Daha fazla relay ekleyerek bağlantı stabilitesini artırıyoruz (ve JSONP SyntaxError sorununu önlüyoruz)
  const peers = [
    'https://gun-rs.iris.to/gun',
    'https://peer.wallie.io/gun'
  ];
  
  const gun = Gun({ peers: peers, localStorage: false });
  
  // Veritabanı referansları
  const todayKey = new Date().toISOString().split('T')[0];
  const chatNode = gun.get('aot-pnasf-chat-' + todayKey);
  const presenceNode = gun.get('aot-pnasf-presence-v3');
  
  let myId = localStorage.getItem('aot_user_id');
  if (!myId) {
    myId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('aot_user_id', myId);
  }
  
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
  
  let myNickname = localStorage.getItem('aot-chat-nick') || '';
  let isChatOpen = false;
  let unreadCount = 0;
  let isFirstLoad = true;
  let messages = [];
  
  // Online oyuncuları takip etmek için map
  const activeUsers = new Map();

  // --- UI KONTROLLERİ ---
  function updateUI() {
    if (myNickname) {
      if(chatNicknameSetup) chatNicknameSetup.classList.add('hidden');
      if(chatInputArea) chatInputArea.classList.remove('hidden');
      if(chatUserNick) chatUserNick.textContent = myNickname + ':';
    } else {
      if(chatNicknameSetup) chatNicknameSetup.classList.remove('hidden');
      if(chatInputArea) chatInputArea.classList.add('hidden');
    }
  }

  if (chatToggleBtn) {
    chatToggleBtn.addEventListener('click', () => {
      isChatOpen = !isChatOpen;
      if (isChatOpen) {
        chatWindow.classList.remove('hidden');
        unreadCount = 0;
        if(chatUnreadBadge) {
            chatUnreadBadge.classList.add('hidden');
            chatUnreadBadge.textContent = '0';
        }
        setTimeout(() => { if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight; }, 50);
        if (chatInput && myNickname) chatInput.focus();
      } else {
        chatWindow.classList.add('hidden');
      }
    });
  }

  if (chatMinimizeBtn) {
    chatMinimizeBtn.addEventListener('click', () => {
      isChatOpen = false;
      chatWindow.classList.add('hidden');
    });
  }

  if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', () => {
      isChatOpen = false;
      chatWindow.classList.add('hidden');
    });
  }

  // --- RUMUZ SİSTEMİ ---
  function setNickname(nick) {
    if (!nick || nick.trim().length < 3) return alert('En az 3 karakterli bir rumuz girin!');
    myNickname = nick.trim().substring(0, 16);
    localStorage.setItem('aot-chat-nick', myNickname);
    updateUI();
    sendHeartbeat();
    sendMessage(`"${myNickname}" sohbete katıldı`, true);
  }

  if (chatSetNicknameBtn && chatNicknameInput) {
    chatSetNicknameBtn.addEventListener('click', () => setNickname(chatNicknameInput.value));
    chatNicknameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') setNickname(chatNicknameInput.value);
    });
  }

  if (chatRandomNick && chatNicknameInput) {
    chatRandomNick.addEventListener('click', () => {
      const adjs = ['Hızlı', 'Korkusuz', 'Gölge', 'Usta', 'Zengin', 'Yırtıcı', 'Sessiz'];
      const nouns = ['Savaşçı', 'Avcı', 'Tüccar', 'Büyücü', 'Okçu', 'Hırsız', 'Şövalye'];
      const r = (arr) => Math.floor(Math.random() * arr.length);
      const nick = `${adjs[r(adjs)]} ${nouns[r(nouns)]}${Math.floor(Math.random() * 99)}`;
      chatNicknameInput.value = nick;
    });
  }

  // --- MESAJLAŞMA SİSTEMİ ---
  function sendMessage(text, isSystem = false) {
    if (!isSystem) {
      if (!chatInput) return;
      text = chatInput.value.trim();
      chatInput.value = '';
    }
    
    if (!text || (!myNickname && !isSystem)) return;
    
    const msg = {
      nick: isSystem ? 'Sistem' : myNickname,
      text: text.substring(0, 200),
      time: Date.now(),
      isSystem: isSystem,
      id: Gun.text.random(10)
    };
    
    chatNode.get(msg.id).put(msg);
  }

  if (chatSendBtn && chatInput) {
    chatSendBtn.addEventListener('click', () => sendMessage(null, false));
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage(null, false);
    });
  }

  // Mesajları Dinle
  let renderedMessages = new Set();
  chatNode.map().on((msg, id) => {
    if (!msg || !msg.text || renderedMessages.has(id)) return;
    
    // Sadece son 24 saatteki mesajları göster
    if (Date.now() - msg.time > 86400000) return;
    
    renderedMessages.add(id);
    messages.push(msg);
    messages.sort((a, b) => a.time - b.time);
    
    // Sadece son 50 mesajı bellekte tut
    if (messages.length > 50) messages = messages.slice(-50);
    
    renderAllMessages();
    
    // Bildirim sesi ve rozet (Sistem mesajı değilse ve kendi mesajımız değilse)
    if (!isChatOpen && !isFirstLoad && msg.nick !== myNickname && !msg.isSystem) {
      unreadCount++;
      if (chatUnreadBadge) {
        chatUnreadBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
        chatUnreadBadge.classList.remove('hidden');
      }
      if (chatToggleBtn) {
        chatToggleBtn.classList.add('animate-bounce');
        setTimeout(() => chatToggleBtn.classList.remove('animate-bounce'), 1000);
      }
    }
  });

  function escapeHTML(str) {
    if(!str) return '';
    return String(str).replace(/[&<>'"]/g, 
      tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag] || tag)
    );
  }

  function renderAllMessages() {
    if (!chatMessages) return;
    chatMessages.innerHTML = '';
    
    messages.forEach(msg => {
      const isMe = msg.nick === myNickname;
      const timeStr = new Date(msg.time).toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'});
      
      const div = document.createElement('div');
      
      if (msg.isSystem) {
        div.className = 'text-center text-xs text-gray-500 py-2 my-2 border-y border-gray-800 bg-black/20 rounded';
        div.innerHTML = `<i class="fa-solid fa-info-circle mr-1"></i>${escapeHTML(msg.text)}`;
      } else {
        div.className = `flex flex-col mb-3 ${isMe ? 'items-end' : 'items-start'}`;
        div.innerHTML = `
          <div class="flex items-baseline gap-2 mb-1">
            <span class="text-[10px] text-gray-500">${timeStr}</span>
            <span class="text-xs font-bold ${isMe ? 'text-albion-accent' : 'text-gray-300'}">${escapeHTML(msg.nick)}</span>
          </div>
          <div class="px-3 py-2 rounded-lg text-sm max-w-[85%] break-words ${
            isMe ? 'bg-albion-700 text-white rounded-br-none shadow-md' : 'bg-albion-900 border border-albion-700 text-gray-200 rounded-bl-none shadow-md'
          }">
            ${escapeHTML(msg.text)}
          </div>
        `;
      }
      chatMessages.appendChild(div);
    });
    
    if (isChatOpen || messages[messages.length - 1]?.nick === myNickname) {
        setTimeout(() => { if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight; }, 50);
    }
  }

  // --- OYUNCU SAYISI (PRESENCE) SİSTEMİ ---
  function sendHeartbeat() {
    presenceNode.get(myId).put({
        time: Date.now(),
        nick: myNickname || 'Misafir'
    });
  }
  
  presenceNode.map().on((data, key) => {
      if (data && data.time) {
          activeUsers.set(key, data);
          updateOnlineCounters();
      }
  });
  
  function updateOnlineCounters() {
    let count = 0;
    const now = Date.now();
    const activeThreshold = 3 * 60 * 1000; // 3 dakika
    
    activeUsers.forEach((data, key) => {
        if (now - data.time < activeThreshold) {
            count++;
        } else {
            activeUsers.delete(key);
        }
    });
    
    // En az 1 kişi (kendimiz) her zaman aktif görünmeli
    const finalCount = Math.max(1, count);
    
    if (chatOnlineCount) chatOnlineCount.textContent = `(${finalCount})`;
    if (headerOnlineCount) headerOnlineCount.textContent = finalCount;
    if (modalOnlineCount) modalOnlineCount.textContent = `(${finalCount})`;
    
    const onlineUsersModal = document.getElementById('onlineUsersModal');
    if (onlineUsersModal && !onlineUsersModal.classList.contains('hidden')) {
        renderOnlineUsersList();
    }
  }
  
  function renderOnlineUsersList() {
      const onlineUsersList = document.getElementById('onlineUsersList');
      if (!onlineUsersList) return;
      
      const now = Date.now();
      let html = '';
      
      const usersArr = Array.from(activeUsers.entries());
      usersArr.sort((a, b) => (a[0] === myId ? -1 : (b[0] === myId ? 1 : b[1].time - a[1].time)));
      
      usersArr.forEach(([key, data]) => {
          if (now - data.time < 3 * 60 * 1000) {
              const nick = data.nick || 'Misafir';
              const isMe = key === myId;
              const timeStr = new Date(data.time).toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'});
              html += `
                <div class="flex items-center justify-between bg-albion-900 border ${isMe ? 'border-albion-accent/50' : 'border-albion-700'} p-3 rounded-lg mb-2 shadow-sm">
                    <div class="flex items-center gap-3">
                        <span class="relative flex h-2.5 w-2.5">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span class="text-white font-bold text-sm ${isMe ? 'text-albion-accent' : ''}">${escapeHTML(nick)} ${isMe ? '<span class="text-[10px] text-gray-500 ml-1">(Sen)</span>' : ''}</span>
                    </div>
                    <span class="text-[10px] text-gray-500">Son görülme: ${timeStr}</span>
                </div>
              `;
          }
      });
      
      onlineUsersList.innerHTML = html || '<p class="text-center text-gray-500 py-6 text-sm">Yalnızsınız...</p>';
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
  
  if (onlineModal) {
      onlineModal.addEventListener('click', (e) => {
          if (e.target === onlineModal) {
              onlineModal.classList.add('hidden');
              onlineModal.classList.remove('flex');
          }
      });
  }

  // Başlangıç işlemleri
  updateUI();
  sendHeartbeat();
  updateOnlineCounters(); // İlk gösterim
  
  // Döngüler
  setInterval(sendHeartbeat, 30000); // Her 30sn'de bir varlık bildir
  setInterval(updateOnlineCounters, 15000); // Her 15 saniyede bir eskiyen kayıtları temizleyip sayacı güncelle

  window.addEventListener('beforeunload', () => {
      presenceNode.get(myId).put({ time: 0 }); // Çıkarken aktifliği düşür
  });

  setTimeout(() => { isFirstLoad = false; }, 3000);
});
