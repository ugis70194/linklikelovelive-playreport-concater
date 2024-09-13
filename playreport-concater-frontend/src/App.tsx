import { useState } from 'react'
import './App.css'

function App() {
  const serverURL = "http://localhost:5000/concat";
  const postOptions = {
    method: "POST",
    body: new FormData()
  };

  const [playReports,        setPlayReports]        = useState<File[]>([]);
  const [stats,              setStats]              = useState<File>(new File([], ""));
  const [bonus,              setBonus]              = useState<File>(new File([], ""));
  const [result,             setResult]             = useState<File>(new File([], ""));
  const [selectedPlayReport, setSelectedPlayReport] = useState<boolean>(false);
  const [selectedOption, setSelectedOption]         = useState<boolean>(false);

  const inputPlayReports = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const images = e.target!.files;
    if (images === null) {
      // ここに null 処理を書く
      return;
    }

    setSelectedPlayReport(true);

    const tmp: File[] = [];
    for(let i = 0; i < images.length; i++) {
      const img = images[i];
      tmp.push(new File([img], `playreport_${i}`, { type: "image/png"}));
    }

    setPlayReports(tmp);
    const anchorPlayReport = document.getElementById("anchor-playreport");
    anchorPlayReport?.click();
  }

  const inputStats = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target!.files;
    if (image === null) {
      return;
    }
    setSelectedOption(true);
    for(const img of image) {
      setStats(new File([img], `stats`, { type: img.type }));
    }

    const anchorPlayReport = document.getElementById("anchor-playreport");
    anchorPlayReport?.click();
  }

  const inputBonus = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target!.files;
    if (image === null) {
      return;
    }
    setSelectedOption(true);
    for(const img of image) {
      setBonus(new File([img], `bonus`, { type: img.type }));
    }

    const anchorPlayReport = document.getElementById("anchor-playreport");
    anchorPlayReport?.click();
  }

  const sendImages = async () => {
    const formData = new FormData();
    if (playReports.length >= 2) {
      for(const playReport of playReports) {
        formData.append(playReport.name, playReport)
      }
    } else {
      alert("くっつけたいプレイレポートを2枚以上選択してください");
      return;
    }
    if (stats.size > 0) {
      formData.append(stats.name, stats);
    }
    if (bonus.size > 0) {
      formData.append(bonus.name, bonus);
    }

    postOptions.body = formData;
    
    const response = await fetch(serverURL, postOptions);
    const blob = await response.blob();
    const file = new File([blob], `result`, { type: "image/png" });
    setResult(file)
  }

  return (
    <>
      <div>
        <p>くっつけたいスクリーンショットを2つ、または3つ選択してください(順不同)</p>
        <div className='center'>
          <label className='btn-square'>
            スクリーンショットを選択
            <input type='file' accept='image/*' onChange={inputPlayReports} multiple />
          </label>
          <div className='spacer' />
          <div className={selectedPlayReport ? "thumb" : ""}>
            {playReports.map((img, idx) => <img key={idx} className='thumbnail' src={URL.createObjectURL(img)} />)}
          </div>
        </div>
      </div>
      <div>
        <p>オプション</p>
        <p>結合したプレイレポートの横にシミュレーション画面とボーナス画面を結合できます。（片方だけでも結合できます）</p>
        <div className='center'>
          <label className='btn-square'>
            シミュレーション画面を選択
            <input type='file' accept='image/*' onChange={inputStats} />
          </label>
          <div className='spacer' />
        </div>
        <div className='center'>
          <label className='btn-square'>
            ボーナス画面を選択
            <input type='file' accept='image/*' onChange={inputBonus} />
          </label>
          <div className='spacer' />
          <div className={selectedOption ? "thumb" : ""}>
            {
              stats.size > 0 && <img className='thumbnail' src={URL.createObjectURL(stats)} />
            }
            {
              bonus.size > 0 && <img className='thumbnail' src={URL.createObjectURL(bonus)} />
            }
          </div>
        </div>
      </div>
      <div className='spacer' />
      <div className='center'>
        <button className="btn-square submit-btn" type='submit' onClick={sendImages}>くっつける</button>
      </div>
      <div className='spacer' />
      <a id='anchor-playreport' href="#bottom"/>
      <a id='bottom' />
      <div className='center'>
        {
          result.size > 0 && <img className='result' src={URL.createObjectURL(result)} />
        }
      </div>
    </>
  )
}

export default App
