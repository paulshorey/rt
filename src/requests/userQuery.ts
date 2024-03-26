import { UserState } from "@/state/user";
import fetcher from "@/utils/fetcher";

export const userQuery = async () => {
  const user: Partial<UserState> = {};
  //
  // ipAddress
  const ipData = await fetcher(`https://api.ipify.org?format=json`, {});
  user.ipAddress = ipData.ip;
  //
  // location
  const locationData = await fetcher(`/api/ip/${user.ipAddress}`, {});
  if (!user.location) user.location = {};
  user.location.countryName = locationData.country;
  user.location.countryCode = locationData.countryCode;
  user.location.regionCode = locationData.region;
  user.location.regionName = locationData.regionName;
  user.location.city = locationData.city;
  user.location.lat = locationData.lat;
  user.location.lon = locationData.lon;
  user.location.timezone = locationData.timezone;
  //
  // weather
  const jsDateTomorrow = new Date();
  jsDateTomorrow.setDate(new Date().getDate() + 1);
  const jsDateYesterday = new Date();
  jsDateYesterday.setDate(new Date().getDate() - 1);
  const strTomorrow = jsDateTomorrow.toISOString().split("T")[0];
  const strYesterday = jsDateYesterday.toISOString().split("T")[0];
  const url = `https://meteostat.p.rapidapi.com/point/daily?lat=${user.location.lat}&lon=${user.location.lon}&start=${strYesterday}&end=${strTomorrow}`;
  const weatherData = await fetcher(url, {
    headers: {
      "x-rapidapi-host": "meteostat.p.rapidapi.com",
      "x-rapidapi-key": "11dc13858emshc2393c506bb7d52p12d7e3jsnc48d54772625",
    },
  });
  if (!user.weatherChange) user.weatherChange = {};
  const w0 = weatherData.data[0];
  const w1 = weatherData.data[1];
  const w2 = weatherData.data[2];
  user.weatherChange.prcpToday = w1.prcp < w0.prcp ? "Sunnier" : w1.prcp > w0.prcp ? "Rainier" : "Same";
  user.weatherChange.prcpTomorrow = w2.prcp < w1.prcp ? "Sunnier" : w2.prcp > w1.prcp ? "Rainier" : "Same";
  user.weatherChange.tempToday = w1.temp < w0.temp ? "Cooler" : w1.temp > w0.temp ? "Warmer" : "Same";
  user.weatherChange.tempTomorrow = w2.temp < w1.temp ? "Cooler" : w2.temp > w1.temp ? "Warmer" : "Same";
  user.weatherChange.wspdToday = w1.wspd < w0.wspd ? "Calmer" : w1.wspd > w0.wspd ? "Windier" : "Same";
  user.weatherChange.wspdTomorrow = w2.wspd < w1.wspd ? "Calmer" : w2.wspd > w1.wspd ? "Windier" : "Same";
  // done
  return user;
};
export default userQuery;
