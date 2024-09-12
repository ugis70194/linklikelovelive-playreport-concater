import { useState } from 'react'
import './App.css'
import imageCompression, { Options } from 'browser-image-compression';

function App() {
  const imageCompressOptions: Options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    fileType: 'image/png',
    initialQuality: 0.85
  }

  const serverURL = "http://localhost:5000/concat";
  const postOptions = {
    method: "POST",
    body: new FormData()
  };

  const [playReports, setPlayReports] = useState<File[]>([]);
  const [stats,       setStats]       = useState<File>(new File([], ""));
  const [bonus,       setBonus]       = useState<File>(new File([], ""));
  const [result,      setResult]      = useState<File>(new File([], ""));

  const compressImage = async (image: File) => {
    try {
      const compressed = await imageCompression(image, imageCompressOptions);
      return compressed;
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  const inputPlayReports = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const images = e.target!.files;
    if (images === null) {
      // ここに null 処理を書く
      return;
    }

    const compressedImages: File[] = [];
    let i = 0;
    for(const image of images) {
      const compressed = await compressImage(image);
      if (compressed === null) {
        console.log('null');
      } else {
        compressedImages.push(new File([compressed], `playreport_${i}`, { type: compressed.type }));
        i++;
      }
    }

    setPlayReports(compressedImages);
    //const anchorPlayReport = document.getElementById("anchor-playreport");
    //anchorPlayReport?.click();
  }

  const inputStats = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target!.files;
    if (image === null) {
      return;
    }

    const compressed = await compressImage(image[0]);
    if (compressed === null) {
      console.log('null');
    } else {
      setStats(new File([compressed], `stats`, { type: compressed.type }));
    }
  }

  const inputBonus = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target!.files;
    if (image === null) {
      return;
    }

    const compressed = await compressImage(image[0]);
    if (compressed === null) {
      console.log('null');
    } else {
      setBonus(new File([compressed], `bonus`, { type: compressed.type }));
    }
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
    for(const [key, value] of formData.entries()) {
      console.log(key, value)
    }
    
    const response = await fetch(serverURL, postOptions);
    const res_json = await response.json();
    console.log(res_json);
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
          <div>
            {playReports.map((img, idx) => <img key={idx} className='thumbnail' src={URL.createObjectURL(img)} />)}
          </div>
          <a id='anchor-playreport' href="#bottom-playreport"/>
          <a id='bottom-playreport' />
        </div>
      </div>
      <div>
        <p>オプション</p>
        <p>結合したプレイレポートの横にステータス画面とボーナス画面を結合できます。（片方だけでも結合できます）</p>
        <div className='center'>
          <label className='btn-square'>
            ステータス画面を選択
            <input type='file' accept='image/*' onChange={inputStats} />
          </label>
          <div className='spacer' />
          {
            stats.size > 0 && <img className='thumbnail' src={URL.createObjectURL(stats)} />
          }
        </div>
        <div className='center'>
          <label className='btn-square'>
            ボーナス画面を選択
            <input type='file' accept='image/*' onChange={inputBonus} />
          </label>
          <div className='spacer' />
          {
            bonus.size > 0 && <img className='thumbnail' src={URL.createObjectURL(bonus)} />
          }
        </div>
      </div>
      <div className='center'>
        <button className='btn-square submit-btn' type='submit' onClick={sendImages}>くっつける</button>
      </div>
      <div className='spacer' />
      <div className='center'>
        {
          result.size > 0 && <img className='result' src={URL.createObjectURL(result)} />
        }
      </div>
    </>
  )
}

export default App
