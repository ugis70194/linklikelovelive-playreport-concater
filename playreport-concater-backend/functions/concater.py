import cv2
import numpy as np
import time
# 全画像グレースケール化 -> 明るいところだけ抜き出す
# 抜き出した画像を元の画像として扱う
# 差分画像をとってノイズ除去
# ノイズをとった差分画像でカード使用回数エリアを抜き出す
# 抜き出した画像を連結
# 連結した画像を出力

class Concater:
  def _clip(self, binray_img: np.ndarray, top = 0):
    """画像の明るいところの上端と下端を返す

    Args:
      binray_img (numpy.ndarray): 二値化画像

    Returns:
      top (int): 明るいところの上端
      bottom (int): 明るいところの下端
    """
    assert(binray_img.ndim == 2)

    height, width = np.shape(binray_img)
    while(binray_img[top].sum() < width/4 and top < height):
      top += 1

    bottom = top
    while(binray_img[bottom].sum() > 1 and bottom < height):
      bottom += 1
    return top, bottom

  def _clipBrightArea(self, img: np.ndarray) -> np.ndarray:
    """画像の明るいところだけを切り抜いて返す

    Args:
      img (numpy.ndarray): 画像

    Returns:
      cliped_img (numpy.ndarray): 明るいところだけ切り抜いた画像
    """
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # 二値化は幸せになるんだ
    nichika = (gray > 128) * 1
    top, bottom = self._clip(nichika)
    left, right = self._clip(nichika.T)
    return img[top:bottom, left:right]

  def _noiseFilter(self, diff_img: np.ndarray, threshold = 0.3) -> np.ndarray:
    """差分画像のノイズを除去する

    Args:
      diff_img (numpy.ndarray): 差分画像(二値化)

    Returns:
      filtered_img (numpy.ndarray): フィルタされた画像
    """
    assert(diff_img.ndim == 2)
    stack = []

    height, width = np.shape(diff_img)
    step = 50
    for h_s in range(0, height, step):
        h_t = min(h_s+step, height)
        target = diff_img[h_s:h_t]
        if np.sum(target) <= height*(h_t-h_s)*threshold:
          stack.append(np.zeros((h_t-h_s, width)))
        else:
          stack.append(np.ones((h_t-h_s, width)))
    
    mask = np.vstack(stack)
    return mask
  
  def _clipsScoreAndSkillReport(self, imgs: list[np.ndarray]) -> list[np.ndarray]:
    """スコアとスキルレポート部分を抜き出す

    Args:
      imgs (list[numpy.ndarray]): プレイレポート画像

    Returns:
      score (numpy.ndarray): スコア部分の画像
      skillReports (list[numpy.ndarray]): スキルレポート部分のリスト
    """
    
    assert(len(imgs) >= 2)
    # グレースケール化
    grays = [cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) for img in imgs]
    # 差分画像
    diff = abs(grays[0] - grays[1])
    nichika = (diff > 128) * 1
    h, w = np.shape(nichika)
    # スキルレポート部分の上端と下端を計算
    
    top, bottom = self._clip(nichika, int(h*0.25))
    # スキルレポート部分を抜き出す
    skillReports = [img[top:bottom] for img in imgs]
    #print(top, bottom)
    #[cv2.imwrite(f"./img/skillreport_{i}.png", img) for i, img in enumerate(skillReports)]
    
    score = imgs[0][0:top]

    return score, skillReports
  
  def concatPlayReport(self, imgs: list[np.ndarray]) -> np.ndarray:
    """連結したプレイレポートを返す

    Args:
      imgs (list[numpy.ndarray]): プレイレポート画像

    Returns:
      concated_img (numpy.ndarray): 連結されたプレイレポート
    """
    
    # 明るいところだけ抜き出す
    imgs = [self._clipBrightArea(img) for img in imgs]
    # スコアとスキルレポートだけ抜き出す
    score, skillReports = self._clipsScoreAndSkillReport(imgs)

    # 連結
    stitcher = cv2.Stitcher.create(cv2.Stitcher_SCANS)
    _, stitchedImg = stitcher.stitch(skillReports)

    _, score_width, _ = np.shape(score)
    _, stitched_width, _ = np.shape(stitchedImg)

    # 幅が合わなかったら小さい方に揃える
    if score_width != stitched_width:
      width = min(score_width, stitched_width)
      score = score[:, [i for i in range(width)]]
      stitchedImg = stitchedImg[:, [i for i in range(width)]]

    # 縦に重ねる
    completeImg = np.vstack([score, stitchedImg])
    return completeImg
  
  def _clipBouns(self, img: np.ndarray) -> np.ndarray:
    pass

  def _clipStats(self, img: np.ndarray) -> np.ndarray:
    pass

  def concat_options(self, playreport: np.ndarray, options: list[np.ndarray]) -> np.ndarray:
    pass