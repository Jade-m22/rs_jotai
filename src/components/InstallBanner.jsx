import '../styles/components/_InstallBanner.scss';

const InstallBanner = ({ onAccept, onClose }) => {
  return (
    <div className="install-banner">
      <p>📱 Tu peux installer l'application pour une meilleure expérience !</p>
      <div className="banner-actions">
        <button onClick={onAccept}>Installer</button>
        <button onClick={onClose}>Plus tard</button>
      </div>
    </div>
  );
};

export default InstallBanner;
