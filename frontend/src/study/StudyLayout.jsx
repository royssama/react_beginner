/**
 * StudyLayout - 학습 페이지 공통 UI 컴포넌트
 */

/** 한 주제 전체 (개요 + 예제 여러 개) */
export const MultiSection = ({ title, overview, children }) => (
  <div className="study-section">
    <h2>{title}</h2>
    <p className="study-desc">{overview}</p>
    <div className="study-examples">{children}</div>
  </div>
);

/**
 * 예제 1개 블록
 * - title: 예제 제목
 * - desc: 무엇을 배우는지
 * - whenToUse: 언제 쓰는지
 * - b001Ref: B001 프로젝트에서의 실제 사용처 (있으면)
 * - code: 소스 코드
 * - demo: 직접 조작해볼 UI
 * - output: 실행 결과 텍스트
 */
export const ExampleBlock = ({ number, title, desc, whenToUse, b001Ref, code, demo, output }) => (
  <div className="study-example-block">
    <div className="study-example-header">
      <span className="study-example-num">예제 {number}</span>
      <h3 className="study-example-title">{title}</h3>
    </div>
    <p className="study-example-desc">{desc}</p>
    {whenToUse && (
      <p className="study-example-when">
        <strong>언제 쓰나요?</strong> {whenToUse}
      </p>
    )}
    {b001Ref && (
      <p className="study-example-b001">
        <strong>B001 실제 코드:</strong> {b001Ref}
      </p>
    )}
    <div className="study-demo">
      <p className="study-demo-label">직접 해보기</p>
      {demo}
      {output && <p className="study-result">{output}</p>}
    </div>
    <p className="study-code-label">소스 코드</p>
    <pre className="study-code">{code}</pre>
  </div>
);

/** 구버전 호환용 단일 섹션 */
export const Section = ({ title, desc, code, demo, result }) => (
  <MultiSection title={title} overview={desc}>
    <ExampleBlock
      number={1}
      title={title}
      desc={desc}
      code={code}
      demo={demo}
      output={result}
    />
  </MultiSection>
);
