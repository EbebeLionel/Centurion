// SettingsPage.tsx - Settings page component
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Header_space/Header';
import './Settings_dec.css';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Settings sections
  const settingSections = [
    { id: 'account', label: 'Account', icon: '👤', color: '#BA8FFF' },
    { id: 'privacy', label: 'Privacy & Security', icon: '🔒', color: '#B900FA' },
    { id: 'system', label: 'System', icon: '⚙️', color: '#35A1EF' },
    { id: 'help', label: 'Help & Support', icon: '❓', color: '#8AF4ED' }
  ];

  // Header navigation handler
  const handleHeaderNavigation = (path: string) => {
    navigate(path);
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const handleSectionClick = (sectionId: string) => {
    navigate(`/settings/${sectionId}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter sections based on search
  const filteredSections = settingSections.filter(section =>
    section.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header Integration */}
      <Header onNavigate={handleHeaderNavigation} />

      <div className="settings-page">
        {/* Back Button */}
        <button className="settings-back-button" onClick={handleBackClick}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
          <span>Back</span>
        </button>

        <div className="settings-container">
          {/* Header */}
          <div className="settings-header">
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">Customize your CENTURION experience</p>
            
            {/* Show current section if navigated to specific section */}
            {section && (
              <div className="current-section">
                Currently viewing: <strong>{settingSections.find(s => s.id === section)?.label || section}</strong>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="settings-search">
            <div className="settings-search-container">
              <span className="settings-search-icon">🔍</span>
              <input
                type="text"
                className="settings-search-input"
                placeholder="Search for the desired setting..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Pie Chart */}
          <div className="pie-chart-container">
            {filteredSections.length > 0 ? (
              <div className="pie-chart">
                {/* Center Hole */}
                <div className="pie-center">
                  <div className="pie-center-icon">⚙️</div>
                  <div className="pie-center-text">
                    {hoveredSection || (section ? settingSections.find(s => s.id === section)?.label : 'Settings')}
                  </div>
                </div>

                {/* Render sections with specific IDs */}
                {filteredSections.map((sectionItem) => (
                  <div
                    key={sectionItem.id}
                    id={`${sectionItem.id}-section`}
                    className={`pie-section ${section === sectionItem.id ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredSection(sectionItem.label)}
                    onMouseLeave={() => setHoveredSection(null)}
                    onClick={() => handleSectionClick(sectionItem.id)}
                  >
                    <div className="pie-section-content">
                      <div className="pie-section-icon">{sectionItem.icon}</div>
                      <div className="pie-section-label">{sectionItem.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                No settings found for "{searchQuery}"
                <br />
                <small>Try searching for: Account, Privacy, System, or Help</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;