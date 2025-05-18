const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const authDiv = document.getElementById('auth');
const appDiv = document.getElementById('app');

const searchInput = document.getElementById('search');
const noteList = document.getElementById('noteList');
const newNoteBtn = document.getElementById('newNoteBtn');
const editorDiv = document.getElementById('editor');
const noteTitleInput = document.getElementById('noteTitle');
const noteContentDiv = document.getElementById('noteContent');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

const gameScoreInput = document.getElementById('gameScore');
const gameLevelInput = document.getElementById('gameLevel');
const gameItemsInput = document.getElementById('gameItems');
const saveGameBtn = document.getElementById('saveGameBtn');

let users = JSON.parse(localStorage.getItem('users') || '{}');
let currentUserEmail = localStorage.getItem('currentUser');
let editingId = null;

function saveUsers() {
  localStorage.setItem('users', JSON.stringify(users));
}

function showApp() {
  authDiv.classList.add('hidden');
  appDiv.classList.remove('hidden');
  renderNotes();
  loadGameData();
}

function login() {
  const email = emailInput.value.trim();
  const pass = passwordInput.value;
  const user = users[email];
  if (user && user.password === pass) {
    currentUserEmail = email;
    localStorage.setItem('currentUser', currentUserEmail);
    showApp();
  } else {
    alert('Invalid credentials');
  }
}

function register() {
  const email = emailInput.value.trim();
  const pass = passwordInput.value;
  if (!email || !pass) return alert('Enter email and password');
  if (users[email]) return alert('User exists');
  users[email] = { password: pass, notes: [], game: { score: 0, level: 0, items: '' } };
  saveUsers();
  alert('Registered! Please login.');
}

function getCurrentUser() {
  return users[currentUserEmail];
}

function renderNotes() {
  const user = getCurrentUser();
  const query = searchInput.value.toLowerCase();
  noteList.innerHTML = '';
  user.notes
    .filter(n => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query))
    .forEach(n => {
      const li = document.createElement('li');
      li.textContent = n.title + ' (' + new Date(n.created).toLocaleString() + ')';
      li.onclick = () => editNote(n.id);
      noteList.appendChild(li);
    });
}

function newNote() {
  editingId = null;
  noteTitleInput.value = '';
  noteContentDiv.innerHTML = '';
  editorDiv.classList.remove('hidden');
}

function editNote(id) {
  const user = getCurrentUser();
  const note = user.notes.find(n => n.id === id);
  if (!note) return;
  editingId = id;
  noteTitleInput.value = note.title;
  noteContentDiv.innerHTML = note.content;
  editorDiv.classList.remove('hidden');
}

function saveNote() {
  const user = getCurrentUser();
  if (!noteTitleInput.value) return alert('Title required');
  if (editingId) {
    const note = user.notes.find(n => n.id === editingId);
    note.title = noteTitleInput.value;
    note.content = noteContentDiv.innerHTML;
  } else {
    user.notes.push({
      id: Date.now(),
      title: noteTitleInput.value,
      content: noteContentDiv.innerHTML,
      created: Date.now()
    });
  }
  saveUsers();
  editorDiv.classList.add('hidden');
  renderNotes();
}

function cancelEdit() {
  editorDiv.classList.add('hidden');
}

function loadGameData() {
  const user = getCurrentUser();
  gameScoreInput.value = user.game.score;
  gameLevelInput.value = user.game.level;
  gameItemsInput.value = user.game.items;
}

function saveGameData() {
  const user = getCurrentUser();
  user.game.score = Number(gameScoreInput.value);
  user.game.level = Number(gameLevelInput.value);
  user.game.items = gameItemsInput.value;
  saveUsers();
  alert('Game data saved');
}

loginBtn.onclick = login;
registerBtn.onclick = register;
newNoteBtn.onclick = newNote;
saveNoteBtn.onclick = saveNote;
cancelEditBtn.onclick = cancelEdit;
searchInput.oninput = renderNotes;
saveGameBtn.onclick = saveGameData;

if (currentUserEmail && users[currentUserEmail]) {
  showApp();
}
