import { useTranslation } from 'react-i18next';

export function Brand() {
  const { t } = useTranslation();

  return (
    <a className="brand" href="#top" aria-label={t('brand.name')}>
      <img
        className="brand__mark"
        src={`${import.meta.env.BASE_URL}favicon.svg`}
        alt=""
      />
      <span className="brand__words">
        <strong>eat a rai dee</strong>
        <small>{t('brand.tagline')}</small>
      </span>
    </a>
  );
}
