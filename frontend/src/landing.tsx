import { useNavigate } from "react-router-dom";

import csb from "./assets/csb.png";

export const Landing = () => {
    const navigate = useNavigate();

    return (
      <div className="flex justify-center">
        <div className="pt-8 max-w-screen-lg">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex justify-center">
              <img src={csb} className="max-w-96" />
            </div>
            <div className="pt-16">
              <div className="flex justify-center">
                <h1 className="text-4xl font-bold text-white">
                  Play Chess Online
                </h1>
              </div>
              <div className="mt-8 flex justify-center">
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => {
                      navigate("/game");
                    }}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded"
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}