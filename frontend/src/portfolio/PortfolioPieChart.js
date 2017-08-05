import React, { Component } from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Legend, Cell, Tooltip } from "recharts";
import styles from "./portfolio.scss";

const COLORS = ["#2E1F27", "#DD7230", "#607744", "#F4C95D", "#E7E393", "3E6990", "#F9A03F"];

class PortfolioPieChart extends Component {
    render() {
        const data = this.props.data;
        return (
            <div className={styles.portfolioChart}>
                <PieChart width={300} height={300}>
                    <Pie
                        isAnimationActive={false}
                        data={data}
                        dataKey="total"
                        nameKey="symbol"
                        cx={150}
                        cy={150}
                        outerRadius={60}
                        fill="#8884d8"
                        label
                    >
                        {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </div>
        );
    }
}

PortfolioPieChart.propTypes = {
    data: PropTypes.array
};

export default PortfolioPieChart;
