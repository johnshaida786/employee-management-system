import React, { useState } from 'react';
import {getSavedAppearance, setAppearance} from './theme';

import {
  UserCog,
  Bell,
  Palette,
  Shield,
  Lock,
  Mail,
  AlertTriangle,
  Monitor,
  Sun,
  Moon,
  Smartphone,
  Eye,
} from 'lucide-react';

const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    className={`toggle ${checked ? 'is-on' : ''}`}
    onClick={() => onChange(!checked)}
    aria-label={label}
    aria-pressed={checked}
  >
    <span className="toggle-knob" />
  </button>
);

const Settings = () => {

  const [notifications, setNotifications] = useState({
    email: true,
    loginAlerts: true,
    appNotifications: false,
  });

  const [appearance, setAppearanceState] =
    useState(getSavedAppearance);

  const handleAppearanceChange = (theme) => {
    setAppearanceState(theme);
    setAppearance(theme);
  };

  return (
    <div className="settings-page">

      <section className="page-hero">
        <h1 className="page-hero-title">
          Settings
        </h1>

        <p className="page-hero-subtitle">
          Manage your account preferences, notifications,
          appearance, and security options. Settings will
          persist to the backend once connected.
        </p>
      </section>

      {/* APPEARANCE */}
      <section className="section-block">

        <h2 className="section-title">
          Appearance
        </h2>

        <div className="card settings-card">

          <div className="setting-row">

            <span className="setting-icon">
              <Palette size={20} />
            </span>

            <div className="setting-text">

              <p className="setting-title">
                Theme
              </p>

              <p className="setting-desc">
                Choose how the application looks.
              </p>

            </div>

          </div>

          <div className="theme-options">

            {[
              {
                key: 'light',
                label: 'Light',
                icon: Sun,
              },
              {
                key: 'dark',
                label: 'Dark',
                icon: Moon,
              },
              {
                key: 'system',
                label: 'System',
                icon: Monitor,
              },
            ].map((opt) => {

              const Icon = opt.icon;

              return (
                <button
                  key={opt.key}
                  type="button"
                  className={`theme-option ${
                    appearance === opt.key
                      ? 'is-selected'
                      : ''
                  }`}
                  onClick={() =>
                    handleAppearanceChange(opt.key)
                  }
                  aria-pressed={
                    appearance === opt.key
                  }
                >
                  <Icon size={18} />
                  <span>
                    {opt.label}
                  </span>
                </button>
              );
            })}

          </div>

        </div>

      </section>

     
    </div>
  );
};

export default Settings;