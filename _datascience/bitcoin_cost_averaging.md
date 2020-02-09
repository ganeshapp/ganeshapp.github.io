---
layout: single
title: "Bitcoin Cost Averaging ROI"
excerpt: "An easy first project to do some basics of Datascience."
classes: wide
author_profile: true
---

```python
from lxml import html
import requests
import numpy as np
import json, requests
import datetime
from datetime import timedelta
import time
import pandas as pd

```


```python
sysdate = datetime.datetime.fromtimestamp(int(time.time())).strftime('%Y-%m-%d %H:%M:%S')
print(sysdate)

file_historical = open('../_data/datasets/bitcoin/historical_price.csv', 'w')

#all headers
header_historical = ['id', 'date', 'open', 'high', 'low', 'close', 'volume', 'market_cap']

# Write headers into files
file_historical.write(','.join(str(e) for e in header_historical) + '\n')
```

    2020-02-09 17:48:55





    46




```python
print((datetime.datetime.fromtimestamp(int(time.time())) - timedelta(days=1)).strftime('%Y%m%d'))
```

    20200208



```python
id = 'bitcoin'
# Historical Data
historical_data_url = 'https://coinmarketcap.com/currencies/' + id + '/historical-data/?start=20100101&end=' + (datetime.datetime.fromtimestamp(int(time.time())) - timedelta(days=2)).strftime('%Y%m%d')
#historical_data_url = 'https://coinmarketcap.com/currencies/bitcoin/historical-data/?start=20200101&end=20200125'

page = requests.get(historical_data_url)
tree = html.fromstring(page.content)
historical_data = tree.xpath('//td/div/text()')
try:
    historical_data_table = np.reshape(np.array(historical_data), (-1, 7))
    for data_historical in historical_data_table:
        date = datetime.datetime.strptime(data_historical[0], "%b %d, %Y").date()
        row_history = [id, date.strftime('%Y-%m-%d'),
                       float(data_historical[1].replace('-', '').replace(',', '') or 0.0),
                       float(data_historical[2].replace('-', '').replace(',', '') or 0.0),
                       float(data_historical[3].replace('-', '').replace(',', '') or 0.0),
                       float(data_historical[4].replace('-', '').replace(',', '') or 0.0),
                       int(data_historical[5].replace('-', '').replace(',', '') or 0),
                       int(data_historical[6].replace('-', '').replace(',', '') or 0)]
        file_historical.write(','.join(str(e) for e in row_history) + '\n')
except Exception as e:
    print("Unexpected error", id, e )
    
file_historical.close()
```


```python
df = pd.read_csv("../../_data/datasets/bitcoin/historical_price.csv")
```

Adding Day of the week to the dataframe


```python
df['weekday'] =pd.to_datetime(df['date']).apply(lambda x: x.weekday())

```


```python
df_invest_period = df[df['date'] >= '2018-09-01']
df_invest_period = df_invest_period.drop(['id','open','high','low','volume','market_cap'], 1)
df_invest_period['investment'] = df_invest_period.apply(lambda row: 100 if row.weekday == 0 else 0, axis=1)
df_invest_period['fee'] = df_invest_period.apply(lambda row: 4 if row.weekday == 0 else 0, axis=1)
df_invest_period['cc_fee'] = df_invest_period.apply(lambda row: 7 if row.weekday == 0 else 0, axis=1)
df_invest_period['gross_investment'] = df_invest_period.apply(lambda row: row.investment + row.cc_fee if row.weekday == 0 else 0, axis=1)
df_invest_period['net_investment'] = df_invest_period.apply(lambda row: row.investment - row.fee if row.weekday == 0 else 0, axis=1)
df_invest_period['bitcoin_balance'] = df_invest_period.apply(lambda row: row.net_investment/row.close if row.weekday == 0 else 0, axis=1)
df_invest_period
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>date</th>
      <th>close</th>
      <th>weekday</th>
      <th>investment</th>
      <th>fee</th>
      <th>cc_fee</th>
      <th>gross_investment</th>
      <th>net_investment</th>
      <th>bitcoin_balance</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2020-02-08</td>
      <td>9865.12</td>
      <td>5</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2020-02-07</td>
      <td>9795.94</td>
      <td>4</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2020-02-06</td>
      <td>9729.80</td>
      <td>3</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2020-02-05</td>
      <td>9613.42</td>
      <td>2</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2020-02-04</td>
      <td>9180.96</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>5</th>
      <td>2020-02-03</td>
      <td>9293.52</td>
      <td>0</td>
      <td>100</td>
      <td>4</td>
      <td>7</td>
      <td>107</td>
      <td>96</td>
      <td>0.010330</td>
    </tr>
    <tr>
      <th>6</th>
      <td>2020-02-02</td>
      <td>9344.37</td>
      <td>6</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>7</th>
      <td>2020-02-01</td>
      <td>9392.88</td>
      <td>5</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>8</th>
      <td>2020-01-31</td>
      <td>9350.53</td>
      <td>4</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>9</th>
      <td>2020-01-30</td>
      <td>9508.99</td>
      <td>3</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>10</th>
      <td>2020-01-29</td>
      <td>9316.63</td>
      <td>2</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>11</th>
      <td>2020-01-28</td>
      <td>9358.59</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>12</th>
      <td>2020-01-27</td>
      <td>8909.82</td>
      <td>0</td>
      <td>100</td>
      <td>4</td>
      <td>7</td>
      <td>107</td>
      <td>96</td>
      <td>0.010775</td>
    </tr>
    <tr>
      <th>13</th>
      <td>2020-01-26</td>
      <td>8596.83</td>
      <td>6</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>14</th>
      <td>2020-01-25</td>
      <td>8367.85</td>
      <td>5</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>15</th>
      <td>2020-01-24</td>
      <td>8445.43</td>
      <td>4</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>16</th>
      <td>2020-01-23</td>
      <td>8406.52</td>
      <td>3</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>17</th>
      <td>2020-01-22</td>
      <td>8680.88</td>
      <td>2</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>18</th>
      <td>2020-01-21</td>
      <td>8745.89</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>19</th>
      <td>2020-01-20</td>
      <td>8657.64</td>
      <td>0</td>
      <td>100</td>
      <td>4</td>
      <td>7</td>
      <td>107</td>
      <td>96</td>
      <td>0.011088</td>
    </tr>
    <tr>
      <th>20</th>
      <td>2020-01-19</td>
      <td>8706.25</td>
      <td>6</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>21</th>
      <td>2020-01-18</td>
      <td>8942.81</td>
      <td>5</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>22</th>
      <td>2020-01-17</td>
      <td>8929.04</td>
      <td>4</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>23</th>
      <td>2020-01-16</td>
      <td>8723.79</td>
      <td>3</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>24</th>
      <td>2020-01-15</td>
      <td>8807.01</td>
      <td>2</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>25</th>
      <td>2020-01-14</td>
      <td>8827.76</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>26</th>
      <td>2020-01-13</td>
      <td>8144.19</td>
      <td>0</td>
      <td>100</td>
      <td>4</td>
      <td>7</td>
      <td>107</td>
      <td>96</td>
      <td>0.011788</td>
    </tr>
    <tr>
      <th>27</th>
      <td>2020-01-12</td>
      <td>8192.49</td>
      <td>6</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>28</th>
      <td>2020-01-11</td>
      <td>8037.54</td>
      <td>5</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>29</th>
      <td>2020-01-10</td>
      <td>8166.55</td>
      <td>4</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>496</th>
      <td>2018-09-30</td>
      <td>6625.56</td>
      <td>6</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>497</th>
      <td>2018-09-29</td>
      <td>6601.96</td>
      <td>5</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>498</th>
      <td>2018-09-28</td>
      <td>6644.13</td>
      <td>4</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>499</th>
      <td>2018-09-27</td>
      <td>6676.75</td>
      <td>3</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>500</th>
      <td>2018-09-26</td>
      <td>6495.00</td>
      <td>2</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>501</th>
      <td>2018-09-25</td>
      <td>6446.47</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>502</th>
      <td>2018-09-24</td>
      <td>6595.41</td>
      <td>0</td>
      <td>100</td>
      <td>4</td>
      <td>7</td>
      <td>107</td>
      <td>96</td>
      <td>0.014556</td>
    </tr>
    <tr>
      <th>503</th>
      <td>2018-09-23</td>
      <td>6710.63</td>
      <td>6</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>504</th>
      <td>2018-09-22</td>
      <td>6721.98</td>
      <td>5</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>505</th>
      <td>2018-09-21</td>
      <td>6734.95</td>
      <td>4</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>506</th>
      <td>2018-09-20</td>
      <td>6519.67</td>
      <td>3</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>507</th>
      <td>2018-09-19</td>
      <td>6398.54</td>
      <td>2</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>508</th>
      <td>2018-09-18</td>
      <td>6371.30</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>509</th>
      <td>2018-09-17</td>
      <td>6281.20</td>
      <td>0</td>
      <td>100</td>
      <td>4</td>
      <td>7</td>
      <td>107</td>
      <td>96</td>
      <td>0.015284</td>
    </tr>
    <tr>
      <th>510</th>
      <td>2018-09-16</td>
      <td>6517.18</td>
      <td>6</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>511</th>
      <td>2018-09-15</td>
      <td>6543.20</td>
      <td>5</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>512</th>
      <td>2018-09-14</td>
      <td>6512.71</td>
      <td>4</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>513</th>
      <td>2018-09-13</td>
      <td>6517.31</td>
      <td>3</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>514</th>
      <td>2018-09-12</td>
      <td>6351.80</td>
      <td>2</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>515</th>
      <td>2018-09-11</td>
      <td>6321.20</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>516</th>
      <td>2018-09-10</td>
      <td>6329.70</td>
      <td>0</td>
      <td>100</td>
      <td>4</td>
      <td>7</td>
      <td>107</td>
      <td>96</td>
      <td>0.015167</td>
    </tr>
    <tr>
      <th>517</th>
      <td>2018-09-09</td>
      <td>6300.86</td>
      <td>6</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>518</th>
      <td>2018-09-08</td>
      <td>6225.98</td>
      <td>5</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>519</th>
      <td>2018-09-07</td>
      <td>6467.07</td>
      <td>4</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>520</th>
      <td>2018-09-06</td>
      <td>6529.17</td>
      <td>3</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>521</th>
      <td>2018-09-05</td>
      <td>6792.83</td>
      <td>2</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>522</th>
      <td>2018-09-04</td>
      <td>7361.66</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>523</th>
      <td>2018-09-03</td>
      <td>7260.06</td>
      <td>0</td>
      <td>100</td>
      <td>4</td>
      <td>7</td>
      <td>107</td>
      <td>96</td>
      <td>0.013223</td>
    </tr>
    <tr>
      <th>524</th>
      <td>2018-09-02</td>
      <td>7272.72</td>
      <td>6</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
    <tr>
      <th>525</th>
      <td>2018-09-01</td>
      <td>7193.25</td>
      <td>5</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0.000000</td>
    </tr>
  </tbody>
</table>
<p>526 rows × 9 columns</p>
</div>




```python
#print(df_invest_period.date.max())
#last_date = df_invest_period.date.max()
#print(df_invest_period.loc[df_invest_period['date'] == last_date, 'close'])
last_price = df_invest_period.iloc[0]['close']

#print()
```


```python
print(df_invest_period['gross_investment'].sum())
print(df_invest_period['gross_investment'].sum()/107)
print(df_invest_period['bitcoin_balance'].sum()*last_price)
print('ROI: ', df_invest_period['bitcoin_balance'].sum()*last_price/df_invest_period['gross_investment'].sum())


```

    8025
    75.0
    11587.24697375027
    ROI:  1.4438937038941146

