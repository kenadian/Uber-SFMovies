export function makeInfoWindowContent({
  imgUrl = null,
  width = null,
  locName = "No Name Supplied",
  height = null,
  funFacts = null
}) {
  // const { imgUrl, width, locName, height = null, funFacts } = windowData;
  const placeImage = imgUrl
    ? `<img alt=${locName} src=${imgUrl} width=${width} ${
        imgUrl.height ? "height=" + imgUrl.height : null
      }/>`
    : "";

  const funFactsLayout = funFacts
    ? `<div className='markerFunFacts' style='font-size: 14px;font-weight:normal'>${funFacts}</div>`
    : "";

  const markerWindowContent = `<div className='markerWindow' style='text-align:center'>
                                    ${placeImage}
                                    <h2 className='markerLocName' >${locName}<h2>
                                      ${funFactsLayout}
                                  </div>`;

  return markerWindowContent;
}
