import classNames from "classnames/bind";
import styles from "./History.module.scss";

const cx = classNames.bind(styles);

const History = () => {
  return (
    <div className={cx("container")}>
      <label for="device">Device:</label>
      <select id="device">
        <option>Node 1</option>
        <option>Node 2</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Temperature</th>
            <th>Humidity</th>
            <th>DateTime</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>241.75</td>
            <td>241.75</td>
            <td>10/03/2020 09:29:49</td>
          </tr>
          <tr>
            <td>241.75</td>
            <td>241.75</td>
            <td>10/03/2020 09:29:52</td>
          </tr>
          <tr>
            <td>242</td>
            <td>242</td>
            <td>10/03/2020 09:29:55</td>
          </tr>
          <tr>
            <td>241</td>
            <td>241</td>
            <td>10/03/2020 09:29:58</td>
          </tr>
          <tr>
            <td>240.75</td>
            <td>240.75</td>
            <td>10/03/2020 09:30:00</td>
          </tr>
          <tr>
            <td>241.75</td>
            <td>241.75</td>
            <td>10/03/2020 09:30:03</td>
          </tr>
          <tr>
            <td>240.75</td>
            <td>240.75</td>
            <td>10/03/2020 09:30:10</td>
          </tr>
          <tr>
            <td>261.5</td>
            <td>261.5</td>
            <td>10/03/2020 09:30:42</td>
          </tr>
          <tr>
            <td>260.25</td>
            <td>260.25</td>
            <td>10/03/2020 09:30:44</td>
          </tr>
          <tr>
            <td>260.5</td>
            <td>260.5</td>
            <td>10/03/2020 09:30:45</td>
          </tr>
        </tbody>
      </table>

      <div className={cx("date-range")}>
        <div className={cx("date")}>
          <label for="start-date">Start Date</label>
          <input type="datetime-local" id="start-date" value="2020-03-09T09:01:03" />
        </div>

        <div className={cx("date")}>
          <label for="end-date">End Date</label>
          <input type="datetime-local" id="end-date" value="2020-03-10T23:59:59" />
        </div>
      </div>
    </div>
  );
};

export default History;
