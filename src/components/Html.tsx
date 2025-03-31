import { useState } from "react";

type SectionsState = {
  [key: string]: boolean;
};

const Html = () => {
  const [openSections, setOpenSections] = useState<SectionsState>({
    pxEmRem: false,
    cssPriority: false,
    flexbox: false,
    marginPadding: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className="space-y-6 ml-64 mr-64">
      <div className="flex justify-center items-center">
        <input
          type="text"
          className="px-4 py-2 justify-center sm:w-full border rounded-3xl border-gray-300"
        />
      </div>
      <div>
        <button
          onClick={() => toggleSection("pxEmRem")}
          className="w-full px-4 py-2 text-lg font-medium text-gray-900 bg-gray-200 rounded-md flex justify-between items-center"
        >
          px, em, rem 의 차이
          <span>{openSections.pxEmRem ? "▲" : "▼"}</span>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openSections.pxEmRem
              ? "max-h-96 opacity-100 mt-2"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 bg-amber-100 rounded-md text-gray-800">
            <p>
              <strong>📌 px:</strong> 픽셀 단위로 고정된 크기 (절대 단위)
            </p>
            <p>
              <strong>📌 em:</strong> 부모 요소의 폰트 크기를 기준으로 크기 조정
            </p>
            <p>
              <strong>📌 rem:</strong> 루트 (`html`) 요소의 폰트 크기를 기준으로
              조정
            </p>
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={() => toggleSection("cssPriority")}
          className="w-full px-4 py-2 text-lg font-medium text-gray-900 bg-gray-200 rounded-md flex justify-between items-center"
        >
          CSS 선택자의 우선순위
          <span>{openSections.cssPriority ? "▲" : "▼"}</span>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openSections.cssPriority
              ? "max-h-96 opacity-100 mt-2"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 bg-amber-100 rounded-md text-gray-800">
            <p>
              ID 선택자의 우선순위가 가장 높으며 그 다음으로 클래스, 태그 선택자
              순서로 적용됩니다. <br />
              만약 우선순위가 같은 선택자가 있다면 나중에 선언된 것이 우선
              적용됩니다.
            </p>
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={() => toggleSection("flexbox")}
          className="w-full px-4 py-2 text-lg font-medium text-gray-900 bg-gray-200 rounded-md flex justify-between items-center"
        >
          Flexbox란
          <span>{openSections.flexbox ? "▲" : "▼"}</span>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openSections.flexbox
              ? "max-h-96 opacity-100 mt-2"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 bg-amber-100 rounded-md text-gray-800">
            <p>
              Flexbox는 요소를 유연하게 배치하고 정렬할 수 있는 강력한
              도구입니다.
              <br />
              부모 컨테이너에 display: flex를 설정하고, 자식 요소들에 대해
              정렬과 배치를 세밀하게 제어할 수 있습니다.
              <br />
              화면 크기에 따라 자동으로 조정되는 유동적인 레이아웃을 손쉽게 만들
              수 있어 반응형 디자인에서 유용합니다.
            </p>
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={() => toggleSection("marginPadding")}
          className="w-full px-4 py-2 text-lg font-medium text-gray-900 bg-gray-200 rounded-md flex justify-between items-center"
        >
          margin과 padding의 차이
          <span>{openSections.marginPadding ? "▲" : "▼"}</span>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openSections.marginPadding
              ? "max-h-96 opacity-100 mt-2"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 bg-amber-100 rounded-md text-gray-800">
            <p>
              <strong>📌 margin:</strong> 요소 외부의 여백을 조정합니다.
            </p>
            <p>
              <strong>📌 padding:</strong> 요소 내부의 여백을 조정합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Html;
