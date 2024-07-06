import { Progress } from "antd";

const guessDistribution = [20, 40, 20, 80, 10];

const States = () => {
  return (
    <>
      <div className="text-center font-[600] text-[19px] mt-4 font-poppins">
        Your Stats -{" "}
        {localStorage.getItem("current_tab")
          ? localStorage.getItem("current_tab")?.charAt(0)?.toUpperCase() +
            localStorage.getItem("current_tab")?.slice(1)
          : "Countries"}
      </div>
      <div className="flex justify-around flex-wrap items-start font-[700] mt-4 font-poppins">
        <div className="flex flex-col  justify-center items-center">
          <div className="text-[20px]">50</div>
          <div className="-mb-2 text-[15px]">Played</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="text-[20px]">93%</div>
          <div className="-mb-2 text-[15px]">Win</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="text-[20px]">29</div>
          <div>
            <div className="-mb-2 text-[15px]">Current</div>
            <div className="">Streaks</div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="text-[20px]">29</div>
          <div className="text-center ">
            <div className="-mb-2 text-[15px]">Max</div>
            <div className="">Streaks</div>
          </div>
        </div>
      </div>
      <div className="mt-[10px]">
        <div className="my-[10px] font-poppins text-[15px] font-[600]">
          Guess Distribution
        </div>
        {guessDistribution.map((el, i) => {
          return (
            <div key={i} className="flex items-start">
              <div className="w-[30px]">{i + 1}.</div>
              <Progress
                percent={el}
                size={["100%", 14]}
                strokeColor={el >= 20 ? "#51ab9f" : "#c3505e"}
                showInfo={false}
              />
              <div className="w-[30px]">({el})</div>
            </div>
          );
        })}
        <div className="my-[10px] text-center font-poppins text-[15px] font-[600]">
          Your Score: 90 (avg.)
        </div>
      </div>
    </>
  );
};

export default States;
