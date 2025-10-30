import Header from "@/components/layout/Header";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="개인정보처리방침" showPrevButton showHomeButton />

      <div className="flex-1 overflow-y-auto px-[20px] py-[30px]">
        <div className="prose prose-sm max-w-none">
          <p className="mb-6">
            이 약관은 교환닷컴(이하 &quot;회사&quot;라 한다)이 가입절차를 거친 회원과, 거치지 않은 비회원 모두
            회사에서 제공하는 서비스(이하 &quot;서비스&quot;라 한다)를 이용함에 있어 개인정보를 어떻게
            수집·보관·이용·파기하는지에 대해 정보를 담은 방침입니다. 회사는 이용자의 권리 보호를 위해
            &quot;개인정보보호법&quot; 제30조에 따라 다음과 같이 개인정보처리방침을 공개합니다. 본
            개인정보처리방침에서 정의하지 않은 용어의 정의는 회사의 서비스 이용약관을 따릅니다.
          </p>

          <h2 className="text-xl font-bold mb-4">1. 수집하는 개인정보의 항목</h2>
          <p className="mb-2">
            회사는 서비스 제공을 위해 아래와 같은 최소한의 개인정보를 수집·처리합니다.
          </p>

          <h3 className="text-lg font-semibold mb-2">1) 회원가입 시 수집되는 개인정보</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              자체 가입(이메일/비밀번호 방식) : 이메일 주소, 비밀번호(단방향 해시), 이메일 인증 여부, 닉네임(무작위
              기본 부여)
            </li>
            <li>
              소셜 로그인(카카오/구글): 소셜 서비스에서 제공하는 회원 식별자(ID), 이메일, (동의 시) 프로필 정보 일부
              <br />※ 실제 연동되는 수집 항목은 각 소셜 로그인 화면에서 동의 절차를 통해 고지·제공됩니다.
            </li>
            <li>만 14세 이상 여부 (회사 약관상 만 14세 미만 가입 금지)</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">2) 기능별 별도로 수집되는 개인정보</h3>

          <h4 className="font-semibold mb-2">가. 학교 인증 시 수집</h4>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>학교 이메일(도메인 포함), 인증 완료 여부/시간</li>
            <li>동일 학교 이메일의 중복 인증 여부(1개 학교 이메일 = 1계정 원칙)</li>
          </ul>
          <p className="mb-4">
            회사는 특정 학교 소속 여부 확인을 위해 학교 이메일을 수집하며, 일부 기능은 인증된 회원에게만 제공되는
            반폐쇄형 서비스 형태로 운영됩니다. 비인증 이용자(비회원, 미인증자)는 해당 기능에 접근할 수 없습니다.
          </p>

          <h4 className="font-semibold mb-2">나. 경쟁률·성적 공유 기능 이용 시 수집</h4>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>사용자가 직접 입력한 학점, 어학성적, 가산점, 지망 대학 등</li>
            <li>비교 목록, 즐겨찾기, 검색어 등 이용 기록</li>
            <li>노출되는 닉네임(무작위로 닉네임 생성)</li>
          </ul>
          <p className="mb-4">
            ※ 지원기간 종료 이후에는 닉네임 등 개인 식별 가능한 표지를 삭제·비식별화하고, 성적·가산점 등의 데이터는
            통계 작성, 분석, 서비스 고도화, 모델 학습, 리포트 발간 등의 목적으로 보관∙활용될 수 있습니다. 이 비식별
            데이터는 회원 탈퇴 이후에도 계속 보관될 수 있습니다.
          </p>

          <h4 className="font-semibold mb-2">다. 커뮤니티 이용 시 수집</h4>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>
              회원 글/댓글: 닉네임(또는 익명 선택 시 익명 표기), 게시글/댓글/이미지 등 첨부, 신고/차단 기록
            </li>
            <li>
              비회원 글/댓글: 익명(고정), 게시글/댓글/이미지 등 첨부, 비회원 글/댓글 수정·삭제를 위한 비밀번호(단방향
              해시 형태)
            </li>
            <li>운영·분쟁 대응 목적의 내부 로그(작성 시각, IP 일부 등)</li>
          </ul>
          <p className="mb-4">
            회원은 닉네임으로 활동할 수 있고, 원할 경우 익명으로 게시할 수 있습니다. 비회원은 항상 익명으로만
            활동합니다.
          </p>

          <h4 className="font-semibold mb-2">라. 자동으로 수집되는 정보(로그)</h4>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>IP 주소, 접속 일시, 이용자 기기·OS·브라우저 정보(유저 에이전트 등)</li>
            <li>쿠키 및 유사 기술을 통한 이용자 활동 기록</li>
            <li>서비스 내 기능 사용 기록(검색/조회/클릭 등), 오류·보안 관련 로그</li>
            <li>부정 이용 탐지 및 접근 제어를 위한 기록</li>
          </ul>
          <p className="mb-4">
            ※ 자동 수집된 로그 정보는 다른 정보와 결합되는지 여부와 처리 형태에 따라 &apos;개인정보&apos;일 수도
            있고 아닐 수도 있습니다. 회사는 이를 서비스 제공, 품질 개선, 부정이용 방지, 보안 목적 범위에서
            처리합니다.
          </p>

          <h4 className="font-semibold mb-2">마. 문의/신고 처리 시 수집 (필요 시)</h4>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>문의/신고 내용에 이용자가 포함시킨 개인정보(이메일, 연락처 등)</li>
            <li>권리침해 신고 시: 요청인/대리인 정보(이름 또는 단체명, 연락처, 증빙 자료 등)</li>
          </ul>

          <h2 className="text-xl font-bold mb-4">2. 개인정보의 처리 목적</h2>
          <p className="mb-2">회사는 수집한 개인정보를 아래 목적 범위에서만 이용합니다.</p>
          <ol className="list-decimal pl-6 mb-6 space-y-1">
            <li>회원 가입/탈퇴 의사 확인, 본인확인, 계정 관리, 재가입 제한 관리</li>
            <li>학교 인증 여부에 따른 폐쇄형 기능 제공 및 접근 권한 제어</li>
            <li>
              커뮤니티 운영(닉네임 또는 익명으로 글/댓글 게시, 비회원 게시글 비밀번호 기반 수정/삭제 등)
            </li>
            <li>교환학생 경쟁률 비교 및 성적 공유 등 핵심 서비스 제공</li>
            <li>서비스 품질 향상, 신규 기능 개발, 통계·분석, 맞춤형 기능 또는 안내 제공</li>
            <li>
              서비스 부정 이용·약관 위반 행위 탐지 및 차단(다중계정 방지, 비정상적 인증 시도 등)
            </li>
            <li>공지·문의 응대, 분쟁 처리, 법령상 의무 이행</li>
            <li>
              지원기간 종료 후 비식별화된 데이터(성적 등)를 활용한 통계 작성, 리포트 발간, 시장 분석, 모델 학습,
              서비스 고도화, 상업적 활용
              <br />- 이 때 개인을 식별할 수 있는 정보(닉네임 등)는 제거·비식별 처리 후 사용합니다.
            </li>
          </ol>

          <h2 className="text-xl font-bold mb-4">3. 개인정보의 보유 및 이용 기간</h2>
          <p className="mb-4">
            회사는 법령에서 정한 기간 또는 이용자로부터 동의 받은 기간 내에서 개인정보를 보유·이용하며, 기간이
            지나면 지체 없이 파기합니다.
          </p>
          <p className="mb-4">
            단, 분쟁 대응, 부정 이용 방지 등 불가피한 경우 예외적으로 일정 기간 보관할 수 있습니다.
          </p>

          <h3 className="text-lg font-semibold mb-2">1. 계정 정보(이메일, 소셜 ID 등)</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>
              회원 탈퇴 시 지체 없이 파기
              <br />- 단, 부정가입/재가입 방지 및 운영상 필요에 따라,
              <br />
              <span className="ml-4">• 회원가입 시 사용한 로그인 이메일</span>
              <br />
              <span className="ml-4">• 학교 인증 이메일(학교 이메일)</span>
              <br />를 탈퇴 후 28일간 보관하며, 이 기간 동안 동일 이메일로의 신규 가입을 제한합니다. 28일 경과 후
              파기합니다.
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">2. 학교 인증 기록</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>
              학교 인증 내역은 계정 유지 기간 동안 보유
              <br />- 탈퇴 시 원칙적으로 파기하나, 부정 이용(중복 인증 등) 방지 목적으로 위 28일 보관 정책이
              적용됩니다.
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">3. 커뮤니티 게시물/댓글</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>
              이용자가 작성한 게시물·댓글은 서비스의 특성상 탈퇴 후에도 남을 수 있습니다(백업/캐시 포함).
            </li>
            <li>
              회사는 가능한 범위 내에서 닉네임을 비식별·가명화하거나 삭제할 수 있도록 합니다.
            </li>
            <li>비회원 게시글 비밀번호(해시)는 해당 게시물 유지기간 동안 보관됩니다.</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">4. 경쟁률·성적 공유 데이터(학점, 어학성적, 가산점, 지원 학교)</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>
              서비스상 표시되는 기간(예: 지원기간) 동안에는 닉네임(가명 포함)과 함께 노출될 수 있습니다.
            </li>
            <li>해당 기간 종료 후에는 닉네임 등 식별자를 삭제하고 비식별 데이터로 전환합니다.</li>
            <li>
              비식별 데이터는 회원 탈퇴 이후에도 통계·연구·리포트 발간·서비스 고도화·상업적 활용 목적으로 계속
              보관할 수 있습니다.
            </li>
            <li>
              이 비식별 데이터는 재식별이 되지 않도록 관리되며, 개별 이용자를 특정할 수 있는 형태로 외부에 제공되지
              않습니다.
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">5. 로그 기록, 보안 관련 기록(IP, 접속 기록 등)</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>보안, 서비스 안정화, 분쟁 대응을 위해 최대 6개월 보관 후 파기합니다.</li>
            <li>관련 법령에서 더 긴 기간을 요구하는 경우 그에 따를 수 있습니다.</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">6. 고객 문의/신고 처리 기록</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>
              분쟁 대비 및 법령 준수 목적상 관련 법령에서 정한 기간(예: 소비자 민원 처리 관련 분쟁 해결 목적 등) 동안
              보관할 수 있습니다.
            </li>
            <li>법정 기간 경과 후 즉시 파기합니다.</li>
          </ul>

          <p className="mb-6">
            전자적 파일은 복구 불가능한 방식으로 삭제하며, 종이 문서는 분쇄 또는 소각 등 물리적으로 파기합니다.
          </p>

          <h2 className="text-xl font-bold mb-4">4. 쿠키 등 자동 수집 기술에 관한 안내</h2>
          <p className="mb-2">
            회사는 이용자 맞춤형 서비스 제공, 보안, 접속 유지, 통계 분석 등을 위해 쿠키(cookie) 및 유사 기술을 사용할
            수 있습니다.
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.</li>
            <li>다만 쿠키 차단 시 일부 기능 이용이 제한될 수 있습니다.</li>
          </ul>

          <h2 className="text-xl font-bold mb-4">5. 개인정보의 제3자 제공</h2>
          <p className="mb-2">
            회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 아래의 경우에는 예외적으로 제공할 수
            있습니다.
          </p>
          <ol className="list-decimal pl-6 mb-4 space-y-1">
            <li>이용자가 사전에 명시적으로 동의한 경우</li>
            <li>법령에 근거하거나 수사기관·감독기관 등이 적법한 절차에 따라 요청한 경우</li>
            <li>생명·신체에 급박한 위해를 방지하기 위해 긴급히 필요한 경우 등 법령이 허용하는 경우</li>
          </ol>
          <p className="mb-6">
            현재 회사는 위 목적 외에 이용자의 개인정보를 제휴사 등 제3자에게 판매하거나 상업적 목적으로 제공하지
            않습니다. (제휴 기능 도입 시 별도 고지 및 동의 절차가 진행됩니다.)
          </p>

          <h2 className="text-xl font-bold mb-4">6. 개인정보 처리의 위탁</h2>
          <p className="mb-4">
            회사는 안정적인 서비스 제공, 시스템 운영, 보안 및 알림 발송 등을 위해 일부 업무를 외부 업체에 위탁할 수
            있습니다. 위탁 시 「개인정보 보호법」에 따라 안전한 처리를 위한 계약을 체결하고 관리·감독합니다.
          </p>
          <p className="mb-6">
            변동사항 발생 시 공지사항 또는 개인정보처리방침을 통해 고지합니다.
          </p>

          <h2 className="text-xl font-bold mb-4">7. 개인정보 자동 수집 장치를 통한 제3자의 정보 수집</h2>
          <h3 className="text-lg font-semibold mb-2">
            1. 정보주체에게 수집하는 방법과 관련 내용은 다음과 같습니다.
          </h3>
          <p className="mb-2">회사의 웹·앱으로부터 제3자가 수집해가는 행태정보는 다음과 같습니다.</p>

          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">수집도구</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">수집해가는 사업자</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">수집 항목</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">수집 목적</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Google Analytics</td>
                  <td className="border border-gray-300 px-4 py-2">구글</td>
                  <td className="border border-gray-300 px-4 py-2">
                    수용자 IP, 위치 정보, 언어 설정, 인구통계 정보, 기기 정보, 행동 데이터, 트래픽 소스, 전환 데이터,
                    사용자 수, 사용자 정의 매개변수, 이커머스 데이터
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    웹·앱 사용 분석, 사용자 경험 개선, 고객 세분화, 회사 내의 성과 측정
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mb-4">
            사용자에게 맞춤 서비스와 편의를 제공하기 위해 이용정보를 저장하고 활용하는 &quot;쿠키(cookie)&quot;를
            수집할 수 있습니다.
          </p>

          <h3 className="text-lg font-semibold mb-2">
            2. 정보주체는 사용 기기 혹은 브라우저의 설정 변경을 통해 제3자에 의한 행태정보 수집을 허용, 차단을 할 수
            있습니다.
          </h3>
          <h4 className="font-semibold mb-2">웹 브라우저</h4>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Chrome : 설정 → 고급 → 개인정보 및 보안 → 서드 파티 쿠키 → 차단</li>
            <li>Microsoft Edge : 설정 → 개인정보, 검색 및 서비스 → 타사 쿠키 차단</li>
            <li>Safari : 설정 → 고급 → &quot;모든 쿠키 차단&quot; 체크</li>
          </ul>

          <h4 className="font-semibold mb-2">모바일</h4>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>
              iOS : 아이폰 설정 → 개인정보보호 선택 → 광고선택 → 광고추적 제한 해제 (OS 버전 별 상이할 수 있음)
            </li>
            <li>
              Android : 구글 설정 → 계정 → 계정 선택 → 광고 선택 → 광고 맞춤설정 선택 해제 (OS 버전 별 상이할 수
              있음)
            </li>
          </ul>

          <h2 className="text-xl font-bold mb-4">8. 이용자의 권리와 행사 방법</h2>
          <ol className="list-decimal pl-6 mb-6 space-y-2">
            <li>
              이용자는 언제든지 서비스 내 설정 화면 또는 문의 창구를 통해 자신의 개인정보를 열람·정정·삭제·처리정지를
              요구할 수 있으며, 회원 탈퇴를 통해 동의를 철회할 수 있습니다.
            </li>
            <li>
              회사는 관련 법령이 허용하는 범위 내에서 지체 없이 필요한 조치를 하며, 본인 여부를 확인하기 위해 추가
              정보를 요청할 수 있습니다.
            </li>
            <li>
              법령에서 달리 정하고 있는 경우(예: 다른 사람의 권리를 침해하는 정보, 법정 보존 의무가 있는 정보)는
              열람·삭제 등이 제한될 수 있습니다.
            </li>
          </ol>

          <h2 className="text-xl font-bold mb-4">9. 만 14세 미만 아동의 개인정보 처리</h2>
          <p className="mb-4">
            회사는 만 14세 미만 이용자의 회원가입을 금지하며, 가입 과정에서 만 14세 이상임을 확인합니다.
          </p>
          <p className="mb-6">
            회사는 원칙적으로 만 14세 미만 아동의 개인정보를 수집·처리하지 않습니다.
          </p>

          <h2 className="text-xl font-bold mb-4">10. 개인정보의 안전성 확보 조치</h2>
          <p className="mb-2">회사는 개인정보를 안전하게 관리하기 위해 다음과 같은 조치를 취합니다.</p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>관리적 조치 : 내부 관리계획 수립 및 시행, 접근권한 최소화, 직원 교육 등</li>
            <li>
              기술적 조치 : 비밀번호 및 비회원 게시글 비밀번호의 단방향 암호화 저장, 접근통제, 이상 징후 모니터링, 로그
              관리 등
            </li>
            <li>물리적 조치 : 서버/데이터베이스 보관 장소에 대한 접근 통제, 백업/복구 관리</li>
          </ul>

          <h2 className="text-xl font-bold mb-4">11. 광고성 정보 및 맞춤형 안내</h2>
          <ol className="list-decimal pl-6 mb-6 space-y-2">
            <li>
              회사는 이용자가 명시적으로 광고성 정보 수신에 동의한 경우에 한하여, 해당 동의 범위 내에서 이메일, 푸시
              알림 등으로 광고성 정보를 발송할 수 있습니다.
              <br />
              이용자는 언제든지 수신 동의를 철회할 수 있습니다.
            </li>
            <li>
              회사는 이용자의 이용 기록을 분석하여, 서비스 내부에서 개인화된 정보, 추천, 안내(예: 경쟁률 알림 등)를
              제공할 수 있습니다.
            </li>
            <li>
              회사는 법률상 금지되는 민감정보(예: 건강정보, 사상·신념 등)를 기반으로 맞춤형 광고·안내를 하지 않습니다.
            </li>
          </ol>

          <h2 className="text-xl font-bold mb-4">12. 개인정보 보호 책임자 및 연락처</h2>
          <p className="mb-2">
            회사는 개인정보 처리에 관한 업무를 총괄하여 책임지고, 이용자의 불만 처리 및 피해 구제 등을 위해
            개인정보 보호책임자를 지정합니다.
          </p>

          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>개인정보 보호책임자 : 양경식</li>
            <li>연락처(이메일) : gaeng02@gyohwan.com</li>
            <li>연락처(전화) : 010-9696-0438</li>
          </ul>

          <p className="mb-2">
            이용자는 위 연락처를 통해 개인정보 열람·정정·삭제·처리정지 요청, 불만처리, 피해구제 등을 문의할 수
            있습니다.
          </p>
          <p className="mb-2">또한 아래 기관에 상담을 요청할 수 있습니다.</p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>개인정보침해신고센터(국번없이 118)</li>
            <li>개인정보분쟁조정위원회</li>
            <li>경찰청 사이버범죄 신고시스템 등</li>
          </ul>

          <h2 className="text-xl font-bold mb-4">13. 고지의 의무</h2>
          <ol className="list-decimal pl-6 mb-6 space-y-2">
            <li>
              회사는 관련 법령 또는 서비스 내용의 변경에 따라 본 개인정보처리방침을 개정할 수 있습니다.
            </li>
            <li>
              본 방침이 변경되는 경우, 변경 내용과 시행일자를 시행 7일 전부터(이용자에게 불리한 변경인 경우 최소 30일
              전부터) 서비스 내 공지사항 등으로 안내합니다.
            </li>
            <li>중대한 변경의 경우 이메일, 알림 등 개별 통지를 시도할 수 있습니다.</li>
          </ol>

          <h2 className="text-xl font-bold mb-4">부칙</h2>
          <p className="mb-6">본 개인정보처리방침(v 1.0)은 2025년 10월 30일부터 적용됩니다.</p>
        </div>
      </div>
    </div>
  );
}
