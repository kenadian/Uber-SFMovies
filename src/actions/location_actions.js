export const LOC_DATA_REQ_MANAGER = "LOC_DATA_REQ_MANAGER";

export function getLocDataReqManager(requestObject = {}) {
  let defaultTimeout = requestObject.dataSource === "server" ? 350 : 0;
  let overLimitTimeout = defaultTimeout * 4;

  const getPlaceRecursive = (value, index, timeout, requestObjectLength) => {
    setTimeout(() => {
      this.getLocationDataInBackground(value).then(response => {
        if (
          response.payload.status &&
          response.payload.status === "OVER_QUERY_LIMIT"
        ) {
          getPlaceRecursive(
            value,
            index,
            overLimitTimeout,
            requestObjectLength
          );
        }
        if (
          response.payload.status &&
          response.payload.status === "OK" &&
          index === requestObjectLength - 1
        ) {
          this.toggleIsGettingGooglePlaceResults(false);
        }
        if (
          response.payload.status &&
          response.payload.status === "ZERO_RESULTS" &&
          index === requestObjectLength - 1
        ) {
          this.toggleIsGettingGooglePlaceResults(false);
        }
        if (
          response.payload.status &&
          response.payload.status === "UNKNOWN_ERROR" &&
          index === requestObjectLength - 1
        ) {
          this.toggleIsGettingGooglePlaceResults(false);
          console.error(
            `Google responded with an "${response.payload.status}" message. Try again.`
          );
        }
      });
    }, timeout);
  };

  requestObject.forEach((value, index) => {
    getPlaceRecursive(
      value,
      index,
      defaultTimeout * index,
      requestObject.length
    );
  });

  return {
    type: LOC_DATA_REQ_MANAGER
  };
}
