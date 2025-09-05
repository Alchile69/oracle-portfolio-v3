import React from 'react';

const Settings = ({ user, isAuthenticated }) => {
  return (
    <div>
      <h1>Settings</h1>
      
      <div className="card">
        <h2 className="module-title">Configuration</h2>
        <p>Paramètres de l'application Oracle MVP</p>
        
        <div style={{ marginTop: '20px' }}>
          <label>Thème</label>
          <select className="input" style={{ marginTop: '8px' }}>
            <option>Dark (actuel)</option>
            <option>Light</option>
          </select>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <label>Langue</label>
          <select className="input" style={{ marginTop: '8px' }}>
            <option>Français</option>
            <option>English</option>
          </select>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <label>Notifications</label>
          <input type="checkbox" style={{ marginLeft: '10px' }} defaultChecked />
          <span style={{ marginLeft: '8px' }}>Activer les notifications</span>
        </div>
      </div>
      
      <div className="card">
        <h2 className="module-title">Compte</h2>
        <p>Statut: {isAuthenticated ? 'Connecté' : 'Déconnecté'}</p>
        <p>Utilisateur: {user?.uid || 'Anonyme'}</p>
        
        <button className="btn" style={{ marginTop: '16px' }}>
          Sauvegarder
        </button>
      </div>
    </div>
  );
};

export default Settings;

