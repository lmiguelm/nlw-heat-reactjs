import { FormEvent, useState } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';

import styles from './styles.module.scss';

export function SendMessageForm() {
  const { user, signOut } = useAuth();

  const [message, setMessage] = useState('');

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    await api.post('/messages', { message });

    setMessage('');
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button type="button" onClick={signOut} className={styles.signOutButton}>
        <VscSignOut size={32} />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>

        <strong className={styles.userName}>{user?.name}</strong>

        <span className={styles.userGithub}>
          <VscGithubInverted size={16} />
          {user?.login}
        </span>
      </header>

      <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
        <label htmlFor="message">Mensagem</label>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          name="mensagem"
          id="message"
          placeholder="Qual sua expectativa para o evento?"
        />

        <button type="submit">Enviar Mensagem</button>
      </form>
    </div>
  );
}
