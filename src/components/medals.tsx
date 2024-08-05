import React, { useState, useEffect } from 'react';
import { Table, Image, Tooltip, TableColumnsType } from 'antd';
import { countryNameGen } from '../consts/countries'
import { extraThings } from '../consts/diamonds';
import { QuestionCircleOutlined } from '@ant-design/icons';


interface Country {
  id: string;
  name: string;
  continent: string;
  flag_url: string;
  gold_medals: number;
  silver_medals: number;
  bronze_medals: number;
  total_medals: number;
  rank: number;
  rank_total_medals: number;
}

const OlympicCountries: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [tableLoading, setTableLoading] = useState<boolean>(true);

  async function fetchOlympicsData(page: number) {
    setTableLoading(true);
    setLoading(true);
    try {
      // 首先加载第一页数据
      const response = await fetch(`https://apis.codante.io/olympic-games/countries?page=${page}`);
      let result = await response.json();
      setCountries(result.data);
      setLoading(false);
      setTableLoading(false); // 首次加载完成，关闭表格加载状态
  
      // 然后异步加载其他分页数据
      let currentPage = page + 1;
      const allCountries = result.data.slice(); // 初始化 with first page data
  
      while (result.links?.next) {
        const _response = await fetch(`https://apis.codante.io/olympic-games/countries?page=${currentPage}`);
        result = await _response.json();
        allCountries.push(...result.data);
        currentPage++;
      }
  
      setCountries(allCountries); // 最终合并所有数据
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false); // 加载流程完成，关闭全局加载状态
    }
  }

  useEffect(() => {
    const fetchCountries = async () => {
        fetchOlympicsData(1)
    };
    fetchCountries();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const columns: TableColumnsType<Country> = [
    {
        title: "排名",
        dataIndex: "rank",
        key: "rank",
        render: (_value: number, record: Country, _index: number) => {
            return <>
            { record.rank > 0 ? `${record.rank}` : "-" }
            </>
        },
        align: 'center'
    },
    {
        title: "国家/地区",
        dataIndex: "name",
        key: "name",
        render: (value: string, record: Country, _index: number) => {
            return (
                <p style={{ textAlign: "left" }}>
                    &nbsp;&nbsp;
                    <Image
                        src={record.flag_url}
                        width={45}
                    ></Image>
                    &nbsp;&nbsp;
                    <span>{countryNameGen.get(record.id) || value}</span>
                </p>
            )
        },
        align: 'center'
    },
    {
      title: "💎 钻石数量",
      dataIndex: "id",
      key: "id_diamond",
      render: (value: string, _record: Country, _index: number) => {
          return <>
            {extraThings.get(value)?.get("diamonds") ?? 0}
          </>
      },
      align: 'center'
    },
    {
        title: "🏅 金牌数量",
        dataIndex: "gold_medals",
        key: "gold_medals",
        align: 'center',
    },
    {
        title: "🥈 银牌数量",
        dataIndex: "silver_medals",
        key: "silver_medals",
        align: 'center',
    },
    {
        title: "🥉 铜牌数量",
        dataIndex: "bronze_medals",
        key: "bronze_medals",
        align: 'center',
    },
    {
        title: (
          <>
            <span>总数</span>
            <Tooltip title="1、💎钻石数量不计入总数。2、按金牌、银牌、铜牌数量依次排序">
              &nbsp;<QuestionCircleOutlined />
          </Tooltip>
          </>
        ),
        dataIndex: "total_medals",
        key: "total_medals",
        align: 'center'
    }
]

  console.log(countryNameGen)
  return (
    <>
        <Table
            rowKey='id'
            size="small"
            columns={columns}
            dataSource={countries}
            pagination={false}
            loading={tableLoading}
            sticky={{ offsetHeader: 111 }}
        >
        </Table>
    </>
  );
};

export default OlympicCountries;
