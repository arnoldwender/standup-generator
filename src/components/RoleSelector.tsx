/* ========================================
   Role Selector — pick your persona to
   generate role-specific standup flavor
   ======================================== */

import { motion } from 'framer-motion';
import type { Role } from '../data/standup-data';
import { ROLE_LABELS } from '../data/standup-data';

const ROLES: Role[] = ['frontend', 'backend', 'devops', 'product-manager', 'designer', 'intern'];

/* Role-specific icons for visual flair */
const ROLE_ICONS: Record<Role, string> = {
  frontend: "\u{1F3A8}",
  backend: "\u{1F5A5}",
  devops: "\u{1F6E0}",
  'product-manager': "\u{1F4CB}",
  designer: "\u2728",
  intern: "\u{1F476}",
};

interface Props {
  role: Role;
  onChange: (role: Role) => void;
}

export default function RoleSelector({ role, onChange }: Props) {
  return (
    <div className="mb-6">
      <label className="block text-[0.6rem] tracking-[3px] text-cyan-400/40 mb-2">
        SELECT ROLE
      </label>
      <div className="grid grid-cols-3 gap-2">
        {ROLES.map((r) => (
          <motion.button
            key={r}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(r)}
            className="text-[0.6rem] tracking-[1px] py-2 px-2 font-mono cursor-pointer border transition-all duration-200"
            style={{
              background: r === role ? 'rgba(0,255,255,0.1)' : 'transparent',
              borderColor: r === role ? '#00ffff' : 'rgba(0,255,255,0.12)',
              color: r === role ? '#00ffff' : 'rgba(0,255,255,0.35)',
            }}
          >
            <span className="text-sm">{ROLE_ICONS[r]}</span>
            <br />
            {ROLE_LABELS[r]}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
