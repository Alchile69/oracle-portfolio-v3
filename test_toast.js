
// Test simple dans la console
window.testToast = () => {
  console.log('Test toast déclenché');
  // Créer un toast manuellement
  const toastDiv = document.createElement('div');
  toastDiv.innerHTML = '✅ Test Toast Réussi !';
  toastDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:#00ff88;color:black;padding:12px;border-radius:8px;z-index:9999;';
  document.body.appendChild(toastDiv);
  setTimeout(() => toastDiv.remove(), 3000);
};
console.log('Fonction testToast() créée. Tapez testToast() dans la console pour tester.');

