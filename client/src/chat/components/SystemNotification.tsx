import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { SystemNotification as Notification } from '../../../../shared/chatConstants.js';

type Props = Notification;

const SystemNotification: React.FC<Props> = ({ type, text }) => {
  const navigate = useNavigate();
  if (type === 'waiting') {
    return (
      <>
        <div className="match-heading text-[#40BFFF] font-bold mb-1 drop-shadow-[0_0_6px_#40BFFF]">MATCH FOUND!</div>
        <div>{text}</div>
        <button
          onClick={() => {
            navigate('/pong?mode=remote2p');
          }}
          className="text-xs text-[#40BFFF] font-orbitron border border-[#40BFFF] rounded px-2 py-1 mt-1 drop-shadow-[0_0_6px_#40BFFF]"
        >
          join match
        </button>
      </>
    );
  }
  return <>{text}</>;
};

export default SystemNotification;
