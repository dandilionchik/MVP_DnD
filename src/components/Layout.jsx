import { useEffect, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  BookText,
  LayoutDashboard,
  LogOut,
  Map,
  Search,
  Settings,
  Shield,
  Sparkles,
  Sword,
  User,
  WandSparkles,
} from "lucide-react";

const roleConfig = {
  player: {
    title: "Игрок",
    subtitle: "Кампании, персонажи и игровые заметки",
    accent: "from-amber-500/30 via-ember/30 to-red-900/40",
    icon: Sword,
    nav: [
      { id: "dashboard", label: "Главная", icon: LayoutDashboard },
      { id: "campaigns", label: "Кампании", icon: Map },
      { id: "characters", label: "Персонажи", icon: Shield },
      { id: "notes", label: "Заметки и мир", icon: BookOpen },
      { id: "rules", label: "Правила", icon: BookText },
    ],
  },
  dm: {
    title: "Мастер",
    subtitle: "Мир, сюжетное проектирование и аналитика",
    accent: "from-red-950/40 via-wine/50 to-amber-900/20",
    icon: WandSparkles,
    nav: [
      { id: "dashboard", label: "Главная", icon: LayoutDashboard },
      { id: "campaigns", label: "Кампании", icon: Map },
      { id: "session", label: "Сессии", icon: Sparkles },
      { id: "analytics", label: "Аналитика", icon: BookText },
      { id: "notes", label: "Заметки", icon: BookOpen },
    ],
  },
};

export function Layout({
  role,
  activePage,
  onPageChange,
  children,
  searchValue,
  onSearchChange,
  onRoleSwitch,
  user,
  notifications,
}) {
  const config = roleConfig[role];

  return (
    <div className="min-h-screen bg-[#0a0707] text-stone-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(191,139,68,0.18),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(143,47,35,0.18),_transparent_24%),linear-gradient(180deg,_rgba(18,13,12,0.92),_rgba(8,6,6,1))]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar config={config} activePage={activePage} onPageChange={onPageChange} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            role={role}
            config={config}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            onRoleSwitch={onRoleSwitch}
            activePage={activePage}
            onPageChange={onPageChange}
            user={user}
            notifications={notifications}
          />
          <main className="flex-1 px-4 pb-8 pt-4 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ config, activePage, onPageChange }) {
  return (
    <aside className="hidden w-[296px] shrink-0 border-r border-white/10 bg-black/20 backdrop-blur-xl lg:flex lg:flex-col">
      <div className={`m-4 rounded-[28px] border border-white/10 bg-gradient-to-br ${config.accent} p-5 shadow-glow`}>
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/25">
          <config.icon className="h-7 w-7 text-parchment" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-parchment/70">DnD Nexus</p>
        <h1 className="mt-2 font-display text-3xl text-parchment">{config.title}</h1>
        <p className="mt-2 text-sm leading-6 text-stone-300">{config.subtitle}</p>
      </div>

      <nav className="flex-1 px-4">
        <p className="px-3 text-xs uppercase tracking-[0.28em] text-stone-500">Навигация</p>
        <div className="mt-4 space-y-2">
          {config.nav.map((item) => {
            const isActive = item.id === activePage;

            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-600/20 to-red-800/30 text-parchment shadow-lg shadow-red-950/30"
                    : "text-stone-400 hover:bg-white/5 hover:text-stone-100"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 transition-transform duration-300 ${
                    isActive ? "scale-110 text-amber-300" : "group-hover:scale-105"
                  }`}
                />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="m-4 rounded-[24px] border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Пространство</p>
        <div className="mt-4 space-y-3 text-sm text-stone-300">
          <div className="flex items-center justify-between rounded-2xl bg-black/20 px-3 py-2">
            <span>Синхронизация заметок</span>
            <span className="text-emerald-300">В сети</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-black/20 px-3 py-2">
            <span>Общие заметки</span>
            <span className="text-amber-200">12 активных</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar({
  role,
  config,
  searchValue,
  onSearchChange,
  onRoleSwitch,
  activePage,
  onPageChange,
  user,
  notifications,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0d0909]/80 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Цифровая платформа для DnD</p>
            <div className="mt-2 flex items-center gap-3">
              <RoleIconBadge config={config} />
              <div>
                <h2 className="font-display text-2xl text-parchment">
                  {role === "player" ? "Кабинет игрока" : "Панель мастера"}
                </h2>
                <p className="text-sm text-stone-400">
                  {role === "player"
                    ? "Все кампании, персонажи и игровые знания собраны в одном месте."
                    : "Управляйте миром, сессиями и структурой кампаний из единого центра."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex min-w-[240px] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-stone-400">
              <Search className="h-4 w-4" />
              <input
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Поиск по кампаниям, заметкам, правилам"
                className="w-full bg-transparent text-sm text-stone-100 outline-none placeholder:text-stone-500"
              />
            </label>

            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications((current) => !current)}
                className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-stone-300 transition hover:bg-white/10"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 ? (
                  <span className="absolute right-2 top-2 min-w-[18px] rounded-full bg-amber-400 px-1 text-center text-[10px] font-semibold text-black">
                    {unreadCount}
                  </span>
                ) : null}
              </button>
              {showNotifications ? (
                <DropdownPanel title="Уведомления">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-2xl border px-4 py-3 ${
                        item.read
                          ? "border-white/8 bg-white/5"
                          : "border-amber-400/20 bg-amber-500/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-stone-100">{item.title}</p>
                          <p className="mt-1 text-xs leading-6 text-stone-400">{item.text}</p>
                        </div>
                        <span
                          className={`mt-1 h-2.5 w-2.5 rounded-full ${
                            item.read ? "bg-stone-600" : "bg-amber-300"
                          }`}
                        />
                      </div>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-stone-500">{item.time}</p>
                    </div>
                  ))}
                </DropdownPanel>
              ) : null}
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => onRoleSwitch("player")}
                className={`rounded-2xl px-4 py-2 text-sm transition ${
                  role === "player"
                    ? "bg-gradient-to-r from-amber-500 to-red-700 text-white shadow-md"
                    : "text-stone-400"
                }`}
              >
                Игрок
              </button>
              <button
                onClick={() => onRoleSwitch("dm")}
                className={`rounded-2xl px-4 py-2 text-sm transition ${
                  role === "dm"
                    ? "bg-gradient-to-r from-red-800 to-stone-900 text-white shadow-md"
                    : "text-stone-400"
                }`}
              >
                Мастер
              </button>
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile((current) => !current)}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-red-800 font-semibold text-white">
                  {user.avatar}
                </div>
                <div>
                  <p className="text-sm text-stone-100">{user.name}</p>
                  <p className="text-xs text-stone-400">{user.handle}</p>
                </div>
              </button>
              {showProfile ? (
                <DropdownPanel title="Аккаунт">
                  {[
                    { label: "Профиль", icon: User },
                    { label: "Настройки", icon: Settings },
                    { label: "Выйти", icon: LogOut },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="flex w-full items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-left text-sm text-stone-200 transition hover:bg-white/10"
                    >
                      <item.icon className="h-4 w-4 text-amber-200" />
                      {item.label}
                    </button>
                  ))}
                </DropdownPanel>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {config.nav.map((item) => {
            const isActive = item.id === activePage;

            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-2xl border px-4 py-2 text-sm transition ${
                  isActive
                    ? "border-amber-400/30 bg-amber-500/10 text-amber-100"
                    : "border-white/10 bg-white/5 text-stone-400"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

function DropdownPanel({ title, children }) {
  return (
    <div className="absolute right-0 top-[calc(100%+12px)] z-30 w-[320px] rounded-[26px] border border-white/10 bg-[#120d0f]/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
      <p className="px-2 pb-3 text-xs uppercase tracking-[0.28em] text-stone-500">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function RoleIconBadge({ config }) {
  const Icon = config.icon;

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/15 bg-gradient-to-br from-amber-500/15 to-red-800/20">
      <Icon className="h-7 w-7 text-amber-200" />
    </div>
  );
}
