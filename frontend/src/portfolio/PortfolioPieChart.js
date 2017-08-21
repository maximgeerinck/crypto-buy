import React, { Component } from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import styles from "./portfolio.scss";
import "../recharts.css";
import PortfolioCustomTooltip from "./PortfolioCustomTooltip";

class PortfolioPieChart extends Component {
    render() {
        const { data, customTooltip } = this.props;

        const COLORS = [
            "#8dd3c7",
            "#ffffb3",
            "#bebada",
            "#fb8072",
            "#80b1d3",
            "#fdb462",
            "#b3de69",
            "#fccde5",
            "#d9d9d9",
            "#bc80bd",
            "#332288",
            "#117733",
            "#999933",
            "#ddcc77",
            "#661100",
            "#cc6677",
            "#882255"
        ];

        const tooltip = customTooltip ? <Tooltip content={<PortfolioCustomTooltip />} /> : <Tooltip />;

        return (
            <div className={styles.portfolioChart}>
                <PieChart width={300} height={300}>
                    <Pie
                        isAnimationActive={false}
                        data={data}
                        dataKey="total"
                        nameKey="symbol"
                        cx={150}
                        cy={120}
                        innerRadius={80}
                        outerRadius={120}
                        fill="#8884d8"
                    >
                        {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Legend />
                    {tooltip}
                </PieChart>
            </div>
        );
    }
}

PortfolioPieChart.propTypes = {
    data: PropTypes.array,
    customTooltip: PropTypes.bool.isRequired
};

PortfolioPieChart.defaultProps = {
    customTooltip: false
};

export default PortfolioPieChart;
