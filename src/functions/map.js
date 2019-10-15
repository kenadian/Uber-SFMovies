export function makeInfoWindowContent(imgUrl, funFacts, locName) {
  const placeImage = imgUrl ? `<img src=${imgUrl} width="250px" />` : "";

  const funFactsLayout = funFacts
    ? `<div className='markerFunFacts' style='font-size: 14px;font-weight:normal'>${funFacts}</div>`
    : "";

  const markerWindowContent = `<div className='markerWindow' style=''>
                                    ${placeImage}
                                    <h2 className='markerLocName'>${locName}<h2>
                                      ${funFactsLayout}
                                  </div>`;

  return markerWindowContent;
}
