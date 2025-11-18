//Google Authentication
import { GoogleOAuthProvider } from "@react-oauth/google";

//components
import Messanger from "./components/Messanger";
import AccountProvider from "./context/AccountProvider";
import NotificationProvider from "./context/NotificationContext";

function App() {
  const clientId = "977110920126-i12d8n3bk95r2k1t1kamsn7mtl9iqrre.apps.googleusercontent.com";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <NotificationProvider>
        <AccountProvider>
          <Messanger />
        </AccountProvider>
      </NotificationProvider>
    </GoogleOAuthProvider>
  );
}
export default App;
