import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import CharacterSheet from './pages/character_sheet/CharacterSheet';
import Header from './components/Header';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import ErrorScreen from './components/ErrorScreen';
import UserDash from './components/UserDash';
import CharacterList from './pages/character_list/CharacterList';
import NewCharacter from './components/NewCharacter';
import HomeScreen from './components/HomeScreen';
import SideBar from './components/SideBar';
import NewCampaign from './components/NewCampaign';
import CampaignList from './pages/campaign_list/CampaignList';
import CampaignControlPanel from './pages/dm_panel/CampaignControlPanel';
import SocketTest from './components/SocketTest';

function App() {
  const [user, setUser] = useState(null);
  const [sideBar, setSideBar] = useState(false);

  useEffect(() => {
    fetch('/api/check_session')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .then(data => setUser(data));
  }, []);

  console.log(user);
  console.log(user?.id);
  return (
    <div>
      <Header
        user={user}
        setUser={setUser}
        sideBar={sideBar}
        setSideBar={setSideBar}
      />
      <SideBar
        user={user}
        setUser={setUser}
        sideBar={sideBar}
        setSideBar={setSideBar}
      />
      <div className="h-screen pt-16">
        <Routes>
          <Route
            path="/"
            element={
              !!user ? (
                <UserDash
                  id={user.id}
                  firstName={user.first_name}
                  lastName={user.last_name}
                />
              ) : (
                <HomeScreen />
              )
            }
          />
          <Route
            path="/login"
            element={<LoginForm user={user} setUser={setUser} />}
          />
          <Route
            path="/signup"
            element={<SignupForm user={user} setUser={setUser} />}
          />
          <Route
            path="/characters/new"
            element={!user ? <ErrorScreen /> : <NewCharacter id={user?.id} />}
          />
          <Route
            path="/characters"
            element={!user ? <ErrorScreen /> : <CharacterList user={user} />}
          />
          <Route
            path="/characters/:id"
            element={!user ? <ErrorScreen /> : <CharacterSheet />}
          />
          <Route
            path="/campaigns/new"
            element={!user ? <ErrorScreen /> : <NewCampaign />}
          />
          <Route
            path="/campaigns"
            element={!user ? <ErrorScreen /> : <CampaignList user={user} />}
          />
          <Route
            path="/campaigns/:id"
            element={!user ? <ErrorScreen /> : <CampaignControlPanel />}
          />
          <Route path="/socket-test" element={<SocketTest />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
