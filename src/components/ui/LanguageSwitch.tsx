import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitch() {
  const { i18n, t } = useTranslation();
  const isThai = i18n.language === 'th';

  return (
    <div className="language-switch" aria-label={t('header.language')}>
      <Languages size={17} aria-hidden="true" />
      <button
        type="button"
        className={
          isThai
            ? 'language-switch__choice is-active'
            : 'language-switch__choice'
        }
        aria-pressed={isThai}
        onClick={() => void i18n.changeLanguage('th')}
      >
        TH
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        className={
          !isThai
            ? 'language-switch__choice is-active'
            : 'language-switch__choice'
        }
        aria-pressed={!isThai}
        onClick={() => void i18n.changeLanguage('en')}
      >
        EN
      </button>
    </div>
  );
}
