import { useState, useEffect } from "react";
import { Star, Download, Heart, Share2, Lock, Code2, ChevronLeft, ShoppingCart, CheckCircle2, ShieldAlert } from "lucide-react";

const SAMPLE_CODE = `GET /api/v1/users/{id}\nResponse: { "id": 1, "name": "홍길동", "email": "user@example.com" }`;

const GUIDE_STEPS = [
  "AI에게 구현하고자 하는 기능 설명",
  "프롬프트 템플릿에 세부 요구사항 입력",
  "생성된 API 스펙 검토 및 수정",
  "실제 코드에 적용",
];

export const PromptDetailPage = ({ promptId, onBack, onPurchase, isLoggedIn, isPurchased }) => {
  const [activeTab, setActiveTab] = useState("샘플");
  const [liked, setLiked] = useState(false);
  const [activeRating, setActiveRating] = useState("전체");

  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportMeta, setReportMeta] = useState({ id: null, type: null });
  const [reportData, setReportData] = useState({ reason: "SPAM", detail: "" });


  const ratings = ["전체", "5점", "4점", "3점", "2점", "1점"];
  const PRICE = 15000;


  // 댓글 목록 불러오기
  const fetchComments = async () => {
    try {
      const currentPromptId = promptId;
      const response = await fetch(`http://localhost:8080/api/prompts/${currentPromptId}/comments`);

      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse && jsonResponse.data) {
          setReviews(jsonResponse.data);
        } else {
          setReviews([]);
        }
      } else {
        console.error("댓글 목록을 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("백엔드 연결 에러:", error);
    }
  };


  // 댓글 생성
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const currentPromptId = promptId;
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:8080/api/prompts/${currentPromptId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newComment
        }),
      });

      if (response.ok) {
        setNewComment("");
        fetchComments();
        alert("댓글이 등록되었습니다!");
      } else {
        alert("댓글 등록 실패");
      }
    } catch (error) {
      console.error("통신 에러:", error);
      alert("백엔드 서버와 통신할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 신고 모달 열기
  const openReportModal = (id, type) => {
    setReportMeta({ id, type });
    setIsReportModalOpen(true);
  };

  // 신고 제출 API 호출
  const handleReportSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          targetId: reportMeta.id,
          reportTargetType: reportMeta.type,
          reason: reportData.reason,
          detail: reportData.detail
        }),
      });

      if (response.ok) {
        alert("신고가 정상적으로 접수되었습니다.");
        setIsReportModalOpen(false);
        setReportData({ reason: "SPAM", detail: "" });
      } else {
        alert("신고 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("신고 에러:", error);
    }
  };

  // '찜하기' 여부 확인 메서드
  const checkLikeStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8080/api/prompts/${promptId}/is-liked`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) setLiked(result.data);
    } catch (error) {
      console.error("찜 상태 확인 실패:", error);
    }
  };

  // '찜하기' 토글 함수
  const handleToggleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/prompts/${promptId}/likes`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setLiked(!liked);
      }
    } catch (error) {
      console.error("찜하기 실패:", error);
    }
  };

  // 상세 페이지 진입시 댓글 목록 불러오기 & 찜하기 여부 체크
  useEffect(() => {
    fetchComments();
    checkLikeStatus();
  }, [promptId]);



  return (
    <div className="min-h-screen pb-16" style={{ background: "var(--background)" }}>
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <h3 className="font-bold text-lg mb-4 text-gray-900">신고하기 ({reportMeta.type})</h3>
            <select
              className="w-full mb-3 p-2 border rounded-lg text-gray-900 bg-white"
              value={reportData.reason}
              onChange={(e) => setReportData({...reportData, reason: e.target.value})}>
              <option value="SPAM">스팸/광고</option>
              <option value="ABUSE">욕설/비방</option>
              <option value="COPYRIGHT">저작권 침해</option>
              <option value="ETC">기타 사유</option>
            </select>
            <textarea
              className="w-full p-2 border rounded-lg mb-4 h-24 text-gray-900 bg-white"
              placeholder="상세 내용을 입력하세요."
              value={reportData.detail}
              onChange={(e) => setReportData({...reportData, detail: e.target.value})} />
            <div className="flex gap-2">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="flex-1 py-2 bg-gray-100 rounded-lg text-sm text-gray-900">취소</button>
              <button
                onClick={handleReportSubmit}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm">제출하기</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pt-6">
        <button onClick={onBack} className="flex items-center gap-1 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: "var(--muted-foreground)" }}>
          <ChevronLeft size={16} /> 마켓으로 돌아가기
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 왼쪽 콘텐츠 */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-2 gap-2 mb-6 rounded-xl overflow-hidden" style={{ height: 240 }}>
              <div className="flex items-center justify-center col-span-1 row-span-2" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                <div className="flex flex-col items-center gap-2 opacity-50">
                  <Code2 size={40} style={{ color: "var(--brand-violet-light)" }} />
                  <span className="font-mono text-xs" style={{ color: "var(--brand-violet-light)" }}>RESTful API</span>
                </div>
              </div>
              <div className="flex items-center justify-center" style={{ background: "var(--muted)", border: "1px solid var(--border-xs)" }}>
                <div className="opacity-40 font-mono text-xs" style={{ color: "var(--accent)" }}>{`{ json }`}</div>
              </div>
              <div className="flex items-center justify-center" style={{ background: "var(--secondary)", border: "1px solid var(--border-xs)" }}>
                <div className="opacity-40 font-mono text-xs" style={{ color: "var(--primary)" }}>{`$ curl -X POST`}</div>
              </div>
            </div>

            <div className="flex gap-1 mb-6 p-1 rounded-lg" style={{ background: "var(--card)" }}>
              {["샘플", "사용 가이드", "리뷰"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="flex-1 py-2 rounded-md text-sm transition-all"
                  style={activeTab === tab ? { background: "var(--primary)", color: "#fff" } : { color: "var(--muted-foreground)" }}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "샘플" && (
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-sm)" }}>
                  <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border-xs)" }}>
                    <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>샘플 결과물</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-bg-subtle)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>무료 공개</span>
                  </div>
                  <div className="p-4" style={{ background: "var(--sidebar)" }}>
                    <pre className="text-sm font-mono overflow-x-auto" style={{ color: "var(--accent)" }}>{SAMPLE_CODE}</pre>
                  </div>
                  <div className="px-4 py-3" style={{ background: "var(--card)" }}>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>* 실제 프롬프트 전체 내용은 구매 후 확인할 수 있습니다.</p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden relative" style={{ border: "1px solid var(--border-md)" }}>
                  <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border-xs)" }}>
                    <span className="flex items-center gap-2 text-sm font-medium" style={{ color: isPurchased ? "var(--success)" : "var(--brand-violet-light)" }}>
                      {isPurchased ? <CheckCircle2 size={14} /> : <Lock size={14} />}
                      {isPurchased ? "구매 완료 — 전체 프롬프트" : "구매 후 공개"}
                    </span>
                  </div>
                  <div className={`p-4 ${!isPurchased ? "blur-sm select-none" : ""}`} style={{ background: "var(--sidebar)" }}>
                    <pre className="text-sm font-mono" style={{ color: "var(--brand-violet-light)" }}>
{`당신은 숙련된 백엔드 아키텍트입니다.
아래 요구사항을 바탕으로 RESTful API를 설계하세요
- 서비스: {{service_name}}
- 주요 엔티티: {{entities}}
- 인증 방식: {{auth_type}}

[출력 형식]
1. 엔드포인트 목록 (HTTP 메서드 + 경로 + 설명)
2. 요청/응답 스키마 (JSON)
3. 에러 코드 정의`}
                    </pre>
                  </div>
                  {!isPurchased && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: "var(--background-overlay)" }}>
                      <Lock size={28} style={{ color: "var(--brand-violet-light)" }} />
                      <div className="text-center">
                        <p className="font-medium mb-1" style={{ color: "var(--foreground)" }}>구매 후 전체 내용을 확인할 수 있습니다</p>
                        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>실제 프롬프트 코드와 커스터마이징 가이드 포함</p>
                      </div>
                      <button onClick={() => onPurchase(promptId || 1)} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ background: "var(--primary)" }}>
                        <ShoppingCart size={14} /> {PRICE.toLocaleString()}원에 구매하기
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "사용 가이드" && (
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-sm)" }}>
                <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--card)", borderBottom: "1px solid var(--border-xs)" }}>
                  <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>사용 가이드</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-bg-subtle)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>무료 공개</span>
                </div>
                <div className="p-5 space-y-3" style={{ background: "var(--sidebar)" }}>
                  {GUIDE_STEPS.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold text-white" style={{ background: "var(--primary)" }}>{i + 1}</div>
                      <p className="text-sm pt-0.5" style={{ color: "var(--foreground)" }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "리뷰" && (
              <div className="space-y-4">
                <div className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border-sm)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium" style={{ color: "var(--foreground)" }}>{reviews.length}개 리뷰</span>
                    <span className="flex items-center gap-1 font-semibold" style={{ color: "var(--brand-gold)" }}>
                      <Star size={14} fill="var(--brand-gold)" /> 4.9
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {ratings.map(r => (
                      <button key={r} onClick={() => setActiveRating(r)} className="px-3 py-1 rounded-full text-sm transition-all"
                        style={activeRating === r ? { background: "var(--primary)", color: "#fff" } : { background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border-sm)" }}>
                        {r}
                      </button>
                    ))}
                  </div>

                  {/* 백엔드 연결 댓글 폼 */}
                  <form onSubmit={handleCommentSubmit} className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="리뷰 내용을 입력하세요."
                      className="flex-1 px-4 py-2 rounded-lg text-sm bg-transparent"
                      style={{ border: "1px solid var(--border-md)", color: "var(--foreground)" }}
                      disabled={loading}
                    />
                    <button type="submit" disabled={loading}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 shrink-0"
                      style={{ background: "var(--primary)" }}>
                      {loading ? "등록 중..." : "등록"}
                    </button>
                  </form>
                </div>

                {/* 백엔드 DB에서 받아온 댓글 목록 바인딩 */}
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    등록된 리뷰가 없습니다.
                  </div>
                ) : (
                  reviews.map((review, i) => (
                    <div key={review.id || i} className="rounded-xl p-4 space-y-2" style={{ background: "var(--card)", border: "1px solid var(--border-xs)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>
                          {(review.username || "U")[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{review.username || "테스트유저"}</p>
                          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{review.createdAt ? review.createdAt.split('T')[0] : "방금 전"}</p>
                        </div>
                        <button onClick={() => openReportModal(review.id, "COMMENT")} className="ml-auto text-xs text-red-500 hover:underline">신고하기</button>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, si) => (
                            <Star key={si} size={12} fill={si < (review.rating || 5) ? "var(--brand-gold)" : "none"} style={{ color: "var(--brand-gold)" }} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm" style={{ color: "var(--secondary-foreground)" }}>{review.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 우측 사이드바 */}
          <div className="lg:w-72 shrink-0">
            <div className="sticky top-20 rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border-md)" }}>
              <div className="p-5 space-y-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "var(--primary-bg-lg)", color: "var(--brand-violet-light)" }}>인기</span>
                <h2 className="font-semibold leading-snug" style={{ color: "var(--foreground)" }}>RESTful API 설계 프롬프트 템플릿</h2>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} fill="var(--brand-gold)" style={{ color: "var(--brand-gold)" }} />
                    ))}
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--brand-gold)" }}>4.9</span>
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>({reviews.length}개 리뷰)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>김</div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>김개발</p>
                    <p className="text-xs flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}><Download size={10} /> 234회 다운로드</p>
                  </div>
                </div>

                {isPurchased ? (
                  <div className="rounded-lg p-4 text-center" style={{ background: "var(--success-bg-subtle)", border: "1px solid var(--success-border)" }}>
                    <CheckCircle2 size={24} className="mx-auto mb-2" style={{ color: "var(--success)" }} />
                    <p className="font-semibold text-sm" style={{ color: "var(--success)" }}>구매 완료</p>
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>전체 프롬프트를 이용할 수 있습니다</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{PRICE.toLocaleString()}원</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>단건 구매 · 영구 이용</p>
                    </div>
                    <button onClick={() => onPurchase(promptId || 1)} className="w-full py-2.5 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90" style={{ background: "var(--gradient-primary)" }}>
                      <ShoppingCart size={15} /> 구매하기
                    </button>
                  </>
                )}

                <div className="flex gap-2">
                  <button
                      onClick={handleToggleLike}
                      className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm transition-all hover:bg-white/5"
                      style={{
                        border: "1px solid var(--border-md)",
                        color: liked ? "var(--destructive)" : "var(--muted-foreground)"
                      }}
                  >
                    <Heart
                        size={14}
                        fill={liked ? "var(--destructive)" : "none"}
                    /> 찜
                  </button>
                  <button onClick={() => openReportModal(promptId || 1, "PROMPT")} className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm" style={{ border: "1px solid var(--border-md)" }}>
                    <ShieldAlert size={14} /> 게시글 신고
                  </button>
                </div>

                <div className="space-y-1.5 pt-1 border-t" style={{ borderColor: "var(--border-xs)" }}>
                  {[["AI 모델", "GPT-4, Claude 3"], ["카테고리", "백엔드 개발"], ["파일 형식", "Markdown + JSON"]].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-xs">
                      <span style={{ color: "var(--muted-foreground)" }}>{k}:</span>
                      <span style={{ color: "var(--foreground)" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
