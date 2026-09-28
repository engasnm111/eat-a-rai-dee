import { LogIn, LogOut, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AuthState } from './useAuth';

interface AuthControlProps {
  auth: AuthState;
  placement: 'header' | 'dialog';
}

export function AuthControl({ auth, placement }: AuthControlProps) {
  const { t } = useTranslation();
  const name =
    typeof auth.user?.user_metadata?.['full_name'] === 'string'
      ? auth.user.user_metadata['full_name']
      : auth.user?.email;

  return (
    <div className={`auth-control auth-control--${placement}`}>
      {auth.user ? (
        <>
          <span className="auth-control__identity" title={name}>
            <UserRound size={16} aria-hidden="true" />
            <span>{name || t('auth.account')}</span>
          </span>
          <button
            type="button"
            className="auth-control__button"
            onClick={() => void auth.signOut()}
            disabled={auth.busy}
          >
            <LogOut size={16} aria-hidden="true" />
            <span>{t('auth.signOut')}</span>
          </button>
        </>
      ) : (
        <button
          type="button"
          className="auth-control__button"
          onClick={() => void auth.signIn()}
          disabled={!auth.configured || !auth.ready || auth.busy}
          title={!auth.configured ? t('auth.notConfigured') : undefined}
        >
          <LogIn size={16} aria-hidden="true" />
          <span>
            {t(placement === 'dialog' ? 'auth.signInShort' : 'auth.signIn')}
          </span>
        </button>
      )}
      {auth.error && (
        <span className="auth-control__error" role="alert">
          {t(`auth.${auth.error}`)}
        </span>
      )}
    </div>
  );
}
