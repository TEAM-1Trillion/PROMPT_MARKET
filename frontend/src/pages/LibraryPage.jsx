import { useState } from "react";
import { User, ShoppingBag, Heart, Settings, Copy, CheckCheck, ChevronRight, Download } from "lucide-react";
import { ProfilePage } from "./ProfilePage.jsx";
import { FavoritesPage } from "./FavoritesPage.jsx";
import { SettingsPage } from "./SettingsPage.jsx";

const PROMPT_TEMPLATE = `당신은 숙련된 백엔드 아키텍트입니다.\n아래 요구사항을 바탕으로 RESTful API를 설계하세요:\n\n[요구사항]\n- [서비스]\n- [주요 엔티티]\n- [인증 방식]\n- [응답 형식]\n\n[출력 형식]\n1. 엔드포인트 목록 (HTTP 메서드 + 경로 + 설명)\n2. 요청/응답 스키마 (JSON)\n3. 에러 코드 정의\n4. 보안 고려사항`;

const EXAMPLE_PROMPTS = [
    { label: "쇼핑몰 주문 API",  vars: { SERVICE_NAME: "ShopMall",   ENTITIES: "User, Product, Order",    AUTH_TYPE: "JWT Bearer",    RESPONSE_FORMAT: "JSON" } },
    { label: "블로그 게시판 API", vars: { SERVICE_NAME: "BlogService", ENTITIES: "User, Post, Comment",     AUTH_TYPE: "OAuth 2.0",     RESPONSE_FORMAT: "JSON+HAL" } },
    { label: "사용자 관리 API",  vars: { SERVICE_NAME: "UserService", ENTITIES: "User, Role, Permission",  AUTH_TYPE: "JWT + Refresh", RESPONSE_FORMAT: "JSON" } },
];

const TIPS = [
    "전체 프롬프트를 한 번에 붙여넣기하세요",
    "[변수] 부분을 실제 값으로 교체하고 사용하세요",
    "AI 모델은 GPT-4 또는 Claude 3 사용을 권장합니다",
    "결과물을 피드백하며 2~3회 반복 시 품질이 향상됩니다",
    "다양한 주제로 시도하면 더 좋은 결과물을 얻을 수 있습니다",
];

const PURCHASED = [
    { id: 1, title: "RESTful API 설계 프롬프트 템플릿", category: "백엔드",    purchasedAt: "2025-05-20" },
    { id: 2, title: "코드 리뷰 자동화 프롬프트 세트",   category: "코드 리뷰", purchasedAt: "2025-05-18" },
];

const NAV_ITEMS = [
    { icon: ShoppingBag, label: "구매 내역", key: "purchases" },
    { icon: User,        label: "프로필",    key: "profile" },
    { icon: Heart,       label: "찜 목록",   key: "favorites" },
    { icon: Settings,    label: "설정",      key: "settings" },
];

export const LibraryPage = ({ purchasedPrompts, onLogout, onSelectPrompt, userEmail, initialNav }) => {
    const [activeNav, setActiveNav] = useState(initialNav || "purchases");
    const [activePrompt, setActivePrompt] = useState(0);
    const [copied, setCopied] = useState(false);
    const [selectedExample, setSelectedExample] = useState(null);

    const highlightVars = (text) =>
        text.split(/(\[[A-Z_]+\])/g).map((part, i) =>
            /^\[[A-Z_]+\]$/.test(part)
                ? <span key={i} className="rounded px-0.5" style={{ background: "var(--gold-bg)", color: "var(--brand-gold)" }}>{part}</span>
                : <span key={i}>{part}</span>
        );

    const handleCopy = () => {
        navigator.clipboard.writeText(PROMPT_TEMPLATE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen flex" style={{ background: "var(--background)" }}>
            <aside className="w-48 shrink-0 hidden md:flex flex-col gap-1 p-4 pt-8" style={{ background: "var(--sidebar)", borderRight: "1px solid var(--border-xs)" }}>
                <div className="flex items-center gap-2 px-2 py-3 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>
                        {userEmail ? userEmail[0].toUpperCase() : "U"}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{userEmail || "사용자"}</p>
                        {purchasedPrompts.length > 0 ? (
                            <span className="text-xs" style={{ color: "var(--brand-violet-light)" }}>유료회원</span>
                        ) : (
                            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>무료회원</span>
                        )}
                    </div>
                </div>
                {NAV_ITEMS.map(item => (
                    <button key={item.key} onClick={() => setActiveNav(item.key)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left"
                            style={activeNav === item.key ? { background: "var(--primary-bg-md)", color: "var(--brand-violet-light)" } : { color: "var(--muted-foreground)" }}>
                        <item.icon size={15} />{item.label}
                    </button>
                ))}
            </aside>

            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex" style={{ background: "var(--sidebar)", borderTop: "1px solid var(--border-sm)" }}>
                {NAV_ITEMS.map(item => (
                    <button key={item.key} onClick={() => setActiveNav(item.key)} className="flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-all"
                            style={{ color: activeNav === item.key ? "var(--brand-violet-light)" : "var(--muted-foreground)" }}>
                        <item.icon size={18} />{item.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 min-w-0 pb-20 md:pb-0">
                {activeNav === "purchases" && (
                    <div className="p-4 md:p-8 max-w-4xl">
                        <h1 className="mb-6 font-semibold" style={{ color: "var(--foreground)", fontSize: "1.1rem" }}>구매 내역</h1>
                        <div className="space-y-3 mb-8">
                            {PURCHASED.map((item, i) => (
                                <button key={item.id} onClick={() => setActivePrompt(i)} className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all"
                                        style={{ background: "var(--card)", border: `1px solid ${activePrompt === i ? "var(--border-2xl)" : "var(--border-sm)"}`, boxShadow: activePrompt === i ? "0 0 15px var(--primary-bg-md)" : "none" }}>
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--secondary)" }}>
                                        <Download size={16} style={{ color: "var(--brand-violet-light)" }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{item.title}</p>
                                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{item.category} · {item.purchasedAt} 구매</p>
                                    </div>
                                    <ChevronRight size={14} style={{ color: "var(--muted-foreground)" }} />
                                </button>
                            ))}
                        </div>

                        <div className="rounded-xl overflow-hidden mb-4" style={{ border: "1px solid var(--border-md)" }}>
                            <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border-xs)" }}>
                                <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Prompt template</span>
                                <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-all"
                                        style={{ background: copied ? "var(--success-bg-subtle)" : "var(--muted)", color: copied ? "var(--success)" : "var(--muted-foreground)", border: "1px solid var(--border-sm)" }}>
                                    {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
                                    {copied ? "복사됨" : "복사"}
                                </button>
                            </div>
                            <div className="p-5" style={{ background: "var(--sidebar)" }}>
                <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed" style={{ color: "var(--secondary-foreground)" }}>
                  {highlightVars(PROMPT_TEMPLATE)}
                </pre>
                            </div>
                            <div className="px-5 py-4" style={{ background: "var(--card)", borderTop: "1px solid var(--border-xs)" }}>
                                <p className="text-xs mb-2 font-medium" style={{ color: "var(--muted-foreground)" }}>Generation type</p>
                                <div className="flex gap-2">
                                    {["Text to text", "Chat mode", "Code output"].map((t, i) => (
                                        <button key={t} className="px-3 py-1 rounded-md text-xs transition-all" style={{ background: i === 0 ? "var(--primary)" : "var(--muted)", color: i === 0 ? "#fff" : "var(--muted-foreground)" }}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl overflow-hidden mb-4" style={{ border: "1px solid var(--border-sm)" }}>
                            <div className="px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border-xs)" }}>
                                <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Example prompts</span>
                            </div>
                            <div style={{ background: "var(--sidebar)" }}>
                                {EXAMPLE_PROMPTS.map((ex, i) => (
                                    <button key={i} onClick={() => setSelectedExample(selectedExample === i ? null : i)} className="w-full text-left p-4 transition-all hover:bg-white/5"
                                            style={{ background: selectedExample === i ? "var(--primary-bg-xs)" : undefined, borderBottom: i < EXAMPLE_PROMPTS.length - 1 ? "1px solid var(--border-xs)" : undefined }}>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm" style={{ color: "var(--secondary-foreground)" }}>{ex.label}</span>
                                            <ChevronRight size={13} style={{ color: "var(--muted-foreground)", transform: selectedExample === i ? "rotate(90deg)" : undefined, transition: "transform 0.2s" }} />
                                        </div>
                                        {selectedExample === i && (
                                            <div className="mt-3 space-y-1">
                                                {Object.entries(ex.vars).map(([k, v]) => (
                                                    <div key={k} className="flex items-start gap-2 text-xs font-mono">
                                                        <span style={{ color: "var(--brand-gold)" }}>[{k}]</span>
                                                        <span style={{ color: "var(--muted-foreground)" }}>→</span>
                                                        <span style={{ color: "var(--accent)" }}>{v}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-sm)" }}>
                            <div className="px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border-xs)" }}>
                                <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Prompt instructions</span>
                            </div>
                            <div className="p-5 space-y-2" style={{ background: "var(--sidebar)" }}>
                                <p className="text-xs font-medium mb-3" style={{ color: "var(--brand-violet-light)" }}>Tips</p>
                                {TIPS.map((tip, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm">
                                        <span style={{ color: "var(--primary)" }}>•</span>
                                        <span style={{ color: "var(--secondary-foreground)" }}>{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeNav === "profile"   && <ProfilePage isPremium={purchasedPrompts.length > 0} onUpgradePremium={() => {}} userEmail={userEmail} />}
                {activeNav === "favorites" && <FavoritesPage onSelectPrompt={onSelectPrompt} />}
                {activeNav === "settings"  && <SettingsPage isPremium={purchasedPrompts.length > 0} onLogout={onLogout} onUpgradePremium={() => {}} userEmail={userEmail} />}
            </div>
        </div>
    );
}
