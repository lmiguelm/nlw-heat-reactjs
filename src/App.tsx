import { LoginBox } from './components/LoginBox';
import { MessageList } from './components/MessageList';
import { SendMessageForm } from './components/SendMessageForm';

import styles from './App.module.scss';

import { useAuth } from './hooks/useAuth';

export function App() {
  const { user } = useAuth();

  return (
    <main className={`${styles.contentWrapper} ${!!user ? styles.contentSigned : ''}`}>
      <MessageList />
      {!!user ? <SendMessageForm /> : <LoginBox />}
    </main>
  );
}
