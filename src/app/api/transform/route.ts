import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// ─── A코스 (일반 서류 면접): 간결한 3문장 마이크로 PREP 스키마 ───
const prepSchemaA = z.object({
  point1: z.string().describe("결론 (P) - 1문장. 두괄식으로 바로 핵심 주장"),
  reason: z.string().describe("경험 요약 (R/E) - 1~2문장. 생기부 경험을 간결하게"),
  point2: z.string().describe("느낀 점·포부 (P) - 1문장. 배운 점 또는 향후 계획"),
  speech_script: z.string().describe("30초 스피킹 대본 - 위 3문장을 자연스럽게 이어서 구어체로 완성 (면접 현장에서 바로 쓸 수 있는 버전)"),
  keywords: z.array(z.string()).max(4).describe("핵심 키워드 3~4개 (플래시카드용, 단어 단위)"),
  advice: z.string().describe("한 가지 핵심 개선 포인트 (간결하게 2문장 이내)"),
  evaluation: z.object({
    is_point_first: z.boolean().describe("첫 문장에서 결론이 바로 나왔는가?"),
    is_relevant: z.boolean().describe("질문의 의도에 맞게 대답했는가?"),
    is_concise: z.boolean().describe("30초 이내로 말할 수 있는 분량인가?"),
    has_personal_story: z.boolean().describe("나만의 경험(생기부 내용)이 담겨 있는가?"),
  }),
});

// ─── B코스 (심층/MMI 면접): 기존 풀다이브 PREP 스키마 ───
const prepSchemaB = z.object({
  point1: z.string().describe("핵심 주장 (결론) - 두괄식으로 명확하게 (2-3문장)"),
  reason: z.string().describe("주장을 뒷받침하는 논리적 근거 (2-3문장)"),
  example: z.string().describe("구체적인 경험이나 사례 (STAR 포함, 3-4문장)"),
  point2: z.string().describe("마무리 요약 및 재강조 (2-3문장)"),
  advice: z.string().describe("논리적 보완을 위한 구체적인 조언"),
  evaluation: z.object({
    is_point_first: z.boolean().describe("핵심 결론이 첫 문장에 두괄식으로 제시되었는가?"),
    is_relevant: z.boolean().describe("질문의 의도에 맞고 동문서답하지 않았는가?"),
    no_abstract_adjectives: z.boolean().describe("추상적 표현 없이 구체적 증거로 뒷받침되었는가?"),
    is_logical_why: z.boolean().describe("이유가 타당하고 논리적 연결이 자연스러운가?"),
    is_structured_reason: z.boolean().describe("'첫째, 둘째'와 같은 구조화 표지를 사용했는가?"),
    has_differentiation: z.boolean().describe("지원자만의 차별화된 통찰(Insight)이 있는가?"),
    has_data_evidence: z.boolean().describe("구체적인 숫자나 성과 데이터가 포함되어 있는가?"),
    has_action_verbs: z.boolean().describe("자신의 행동을 구체적인 동사로 묘사했는가?"),
    has_vision_connection: z.boolean().describe("입학 후 목표나 학과 비전과 연결하여 마무리했는가?"),
  }),
});

const SYSTEM_PROMPT_A = `당신은 '5D-Say 면접 코치'입니다.
일반 서류 면접(5~10분)을 준비하는 고등학생을 돕습니다.

[핵심 원칙]
- 복잡한 논리 구성보다 간결하고 조리 있는 요약이 목표입니다.
- 학생이 생기부 내용을 3문장(결론-경험-느낀점)으로 요약해 말할 수 있도록 도와주세요.
- 30초 내로 말할 수 있는 분량이어야 합니다.
- 어렵고 추상적인 표현보다 학생의 실제 경험을 쉬운 말로 담아주세요.

[마이크로 PREP 구조]
1. Point: "저는 ~~한 경험을 했습니다." (결론 먼저)
2. Reason/Example: "생기부에서 ~~를 하면서 ~~를 배웠습니다." (경험 요약)
3. Point2: "이 경험을 통해 ~~를 느꼈고, ~~에서 활용하고 싶습니다." (포부)`;

const SYSTEM_PROMPT_B = `당신은 '5D-Say 면접'의 엄격하고 냉철한 AI 입학사정관입니다.
심층/MMI 면접(10분~50분)을 준비하는 상위권 고등학생을 대상으로 합니다.
사용자의 스크립트를 분석하여 PREP 구조와 체크리스트를 기준으로 평가합니다.

[평가 가이드라인 - 업계 최고 수준의 엄격함 적용]
- is_relevant : 질문의 핵심 키워드가 답변에 포함되어 있지 않으면 False
- has_data_evidence : 숫자(%, 원, 명)가 명시적으로 없으면 False
- is_point_first : 첫 문장에서 핵심 결론이 나오지 않으면 False
- is_structured_reason : '첫째, 둘째' 등 구조화 표지가 없으면 False
- has_differentiation : 누구나 쓸 수 있는 상투적 표현만 있으면 False
- has_vision_connection : 마지막 문장이 학과 기여 방안으로 연결 안되면 False

[합격 스크립트 작성 가이드]
- P(Point): 직접적인 선언적 결론
- R(Reason): 구조화 표지(첫째/둘째) 사용
- E(Example): 숫자 기반 STAR 기법
- P(Point): 입학 후 목표 연결`;

export async function POST(req: Request) {
  const { input, question, track } = await req.json();

  if (track === 'A') {
    const result = await streamObject({
      model: openai('gpt-4o'),
      schema: prepSchemaA,
      temperature: 0.3,
      system: SYSTEM_PROMPT_A,
      prompt: `질문: ${question || '자기소개를 해보세요.'}\n학생 입력: ${input}`,
    });
    return result.toTextStreamResponse();
  } else {
    const result = await streamObject({
      model: openai('gpt-4o'),
      schema: prepSchemaB,
      temperature: 0.1,
      system: SYSTEM_PROMPT_B,
      prompt: `질문: ${question || '자기소개/면접 답변'}\n사용자 입력: ${input}`,
    });
    return result.toTextStreamResponse();
  }
}
