import { useState } from "react";
import { Star, Download, Edit2, Code2, CheckCircle2, TrendingUp } from "lucide-react";

const MY_PROMPTS = [
  { id: 1, title: "Spring Boot 프로젝트 구조 생성기", category: "백엔드", price: 12000, rating: 4.8, downloads: 89,  sales: 1068000 },
  { id: 2, title: "JWT 인증 구현 가이드 프롬프트",    category: "백엔드", price: 9000,  rating: 4.6, downloads: 64,  sales: 576000  },
];
const ACTIVITY = [
  { date: "2025-05-20", text: "RESTful API 설계 프롬프트 템플릿 구매" },
  { date: "2025-05-18", text: "코드 리뷰 자동화 프롬프트 세트 구매" },
  { date: "2025-05-15", text: "Spring Boot 프로젝트 구조 생성기 판매 10회 달성" },
  { date: "2025-05-10", text: "JWT 인증 구현 가이드 프롬프트 등록" },
];

export const ProfilePage = ({ isPremium, onUpgradePremium, userEmail }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const totalSales = MY_PROMPTS.reduce((sum, p) => sum + p.sales, 0);
  const totalDownloads = MY_PROMPTS.reduce((sum, p) => sum + p.downloads, 0);

  return (
      <div className="min-h-screen pb-16" style={{ background: "var(--background)" }}>
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <div className="rounded-2xl p-6 mb-6 relative overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border-md)" }}>
            <div className="absolute top-0 right-0 w-48 h-48 opacity-10 rounded-full" style={{ background: "var(--gradient-hero)", transform: "translate(30%, -30%)" }} />
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center relative">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white" style={{ background: "var(--gradient-profile)" }}>
                  {userEmail ? userEmail[0].toUpperCase() : "U"}
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--muted)", border: "2px solid var(--background)" }}>
                  <Edit2 size={10} style={{ color: "var(--brand-violet-light)" }} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-bold" style={{ color: "var(--foreground)", fontSize: "1.25rem" }}>{userEmail || "사용자"}</h1>
                  {isPremium ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "var(--primary-bg-md)", color: "var(--brand-violet-light)", border: "1px solid var(--border-lg)" }}>유료회원</span>
                  ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border-sm)" }}>무료회원</span>
                  )}
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: "var(--primary-bg-md)", color: "var(--brand-violet-light)", border: "1px solid var(--border-lg)" }}>
                  <CheckCircle2 size={10} /> 인증 판매자
                </span>
                </div>
                <p className="text-sm mb-2" style={{ color: "var(--muted-foreground)" }}>{userEmail}</p>
                <p className="text-sm" style={{ color: "var(--secondary-foreground)" }}>스타일 통합 담당 · Spring Boot / React 개발자</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-5" style={{ borderTop: "1px solid var(--border-xs)" }}>
              {[
                { label: "등록 프롬프트", value: MY_PROMPTS.length,                 Icon: Code2,      color: "var(--brand-violet-light)" },
                { label: "총 다운로드",   value: totalDownloads,                     Icon: Download,   color: "var(--accent)" },
                { label: "총 판매액",     value: `${totalSales.toLocaleString()}원`, Icon: TrendingUp, color: "var(--brand-gold)" },
              ].map(({ label, value, Icon, color }) => (
                  <div key={label} className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Icon size={13} style={{ color }} />
                      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</span>
                    </div>
                    <p className="font-bold" style={{ color: "var(--foreground)" }}>{value}</p>
                  </div>
              ))}
            </div>
          </div>

          <div className="flex gap-1 p-1 rounded-lg mb-6" style={{ background: "var(--card)" }}>
            {["overview", "myprompts", "activity"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="flex-1 py-2 rounded-md text-sm transition-all"
                        style={activeTab === tab ? { background: "var(--primary)", color: "#fff" } : { color: "var(--muted-foreground)" }}>
                  {tab === "overview" ? "개요" : tab === "myprompts" ? "내 프롬프트" : "활동 내역"}
                </button>
            ))}
          </div>

          {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                  <h3 className="text-sm font-medium mb-3" style={{ color: "var(--foreground)" }}>구매 상태</h3>
                  {isPremium ? (
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium" style={{ color: "var(--foreground)" }}>유료회원</p>
                          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>프롬프트 구매 이력이 있습니다</p>
                        </div>
                      </div>
                  ) : (
                      <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>무료 회원 · 샘플 및 가이드 열람 가능</p>
                  )}
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                  <h3 className="text-sm font-medium mb-3" style={{ color: "var(--foreground)" }}>최근 활동</h3>
                  <div className="space-y-3">
                    {ACTIVITY.slice(0, 3).map((a, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--primary)" }} />
                          <div>
                            <p className="text-sm" style={{ color: "var(--secondary-foreground)" }}>{a.text}</p>
                            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{a.date}</p>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
          )}

          {activeTab === "myprompts" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>등록한 프롬프트 {MY_PROMPTS.length}개</span>
                  <button className="text-sm px-3 py-1.5 rounded-lg font-medium text-white" style={{ background: "var(--primary)" }}>+ 프롬프트 등록</button>
                </div>
                {MY_PROMPTS.map(p => (
                    <div key={p.id} className="rounded-xl p-4 flex items-center gap-4" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--secondary)" }}>
                        <Code2 size={16} style={{ color: "var(--brand-violet-light)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{p.title}</p>
                        <div className="flex items-center gap-3 text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                          <span>{p.category}</span>
                          <span className="flex items-center gap-0.5"><Star size={10} fill="var(--brand-gold)" style={{ color: "var(--brand-gold)" }} /> {p.rating}</span>
                          <span className="flex items-center gap-0.5"><Download size={10} /> {p.downloads}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold" style={{ color: "var(--brand-violet-light)" }}>{p.price.toLocaleString()}원</p>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>판매액 {p.sales.toLocaleString()}원</p>
                      </div>
                    </div>
                ))}
              </div>
          )}

          {activeTab === "activity" && (
              <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                {ACTIVITY.map((a, i) => (
                    <div key={i} className="flex items-start gap-4 px-5 py-4" style={{ borderBottom: i < ACTIVITY.length - 1 ? "1px solid var(--border-xs)" : undefined }}>
                      <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: "var(--primary)" }} />
                      <div>
                        <p className="text-sm" style={{ color: "var(--secondary-foreground)" }}>{a.text}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{a.date}</p>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}