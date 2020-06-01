// import { ResponsiveBar } from "niv"
import { ResponsiveBar } from "@nivo/bar";
import React, { Component } from "react";
import LocalBoardService from "../../services/LocalBoardService";
import { connect } from "react-redux";

class NivoBar extends Component {
  state = {
    data: [
      {
        country: "AD",
        "hot dog": 29,
        "hot dogColor": "hsl(241, 70%, 50%)",
        // burger: 156,
        // burgerColor: "hsl(318, 70%, 50%)",
        // sandwich: 186,
        // sandwichColor: "hsl(115, 70%, 50%)",
        // kebab: 83,
        // kebabColor: "hsl(330, 70%, 50%)",
        // fries: 33,
        // friesColor: "hsl(264, 70%, 50%)",
        // donut: 12,
        // donutColor: "hsl(319, 70%, 50%)",
      },
      {
        country: "AE",
        "hot dog": 7,
        "hot dogColor": "hsl(1, 70%, 50%)",
        // burger: 179,
        // burgerColor: "hsl(204, 70%, 50%)",
        // sandwich: 47,
        // sandwichColor: "hsl(307, 70%, 50%)",
        // kebab: 128,
        // kebabColor: "hsl(166, 70%, 50%)",
        // fries: 141,
        // friesColor: "hsl(117, 70%, 50%)",
        // donut: 148,
        // donutColor: "hsl(320, 70%, 50%)",
      },
      {
        country: "AF",
        "hot dog": 23,
        "hot dogColor": "hsl(29, 70%, 50%)",
        // burger: 146,
        // burgerColor: "hsl(110, 70%, 50%)",
        // sandwich: 173,
        // sandwichColor: "hsl(108, 70%, 50%)",
        // kebab: 112,
        // kebabColor: "hsl(216, 70%, 50%)",
        // fries: 167,
        // friesColor: "hsl(336, 70%, 50%)",
        // donut: 55,
        // donutColor: "hsl(246, 70%, 50%)",
      },
      {
        country: "AG",
        "hot dog": 13,
        "hot dogColor": "hsl(61, 70%, 50%)",
        // burger: 197,
        // burgerColor: "hsl(8, 70%, 50%)",
        // sandwich: 196,
        // sandwichColor: "hsl(323, 70%, 50%)",
        // kebab: 93,
        // kebabColor: "hsl(266, 70%, 50%)",
        // fries: 135,
        // friesColor: "hsl(336, 70%, 50%)",
        // donut: 23,
        // donutColor: "hsl(179, 70%, 50%)",
      },
      {
        country: "AI",
        "hot dog": 18,
        "hot dogColor": "hsl(49, 70%, 50%)",
        // burger: 86,
        // burgerColor: "hsl(311, 70%, 50%)",
        // sandwich: 39,
        // sandwichColor: "hsl(215, 70%, 50%)",
        // kebab: 119,
        // kebabColor: "hsl(185, 70%, 50%)",
        // fries: 10,
        // friesColor: "hsl(226, 70%, 50%)",
        // donut: 139,
        // donutColor: "hsl(345, 70%, 50%)",
      },
      {
        country: "AL",
        "hot dog": 15,
        "hot dogColor": "hsl(27, 70%, 50%)",
        // burger: 75,
        // burgerColor: "hsl(120, 70%, 50%)",
        // sandwich: 87,
        // sandwichColor: "hsl(66, 70%, 50%)",
        // kebab: 59,
        // kebabColor: "hsl(356, 70%, 50%)",
        // fries: 10,
        // friesColor: "hsl(279, 70%, 50%)",
        // donut: 53,
        // donutColor: "hsl(339, 70%, 50%)",
      },
      {
        country: "AM",
        "hot dog": 19,
        "hot dogColor": "hsl(147, 70%, 50%)",
        burger: 53,
        burgerColor: "hsl(337, 70%, 50%)",
        // sandwich: 192,
        // sandwichColor: "hsl(84, 70%, 50%)",
        // kebab: 19,
        // kebabColor: "hsl(300, 70%, 50%)",
        // fries: 43,
        // friesColor: "hsl(21, 70%, 50%)",
        // donut: 79,
        // donutColor: "hsl(129, 70%, 50%)",
      },
    ],
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { board } = this.props;
    let data = LocalBoardService.getNivoData(board);
    console.log(data);
    this.setState({ data });
  };

  //   stories.add('using custom color', () => (
  //     <Bar {...commonProps} colors={({ id, data }) => data[`${id}Color`]} />
  // ))

  render() {
    const { data } = this.state;
    return (
      <div className="nivo-bar">
        <ResponsiveBar
          data={data}
          keys={["done", "working", "stuck", "review", "others"]}
          indexBy="group"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          colors={({ id, data }) => data[`${id}Color`]}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "#38bcb2",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "#eed312",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          //   fill={[
          //     {
          //       match: {
          //         id: "stuck",
          //       },
          //       id: "dots",
          //     },
          //     {
          //       match: {
          //         id: "done",
          //       },
          //       id: "lines",
          //     },
          //   ]}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Groups",
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Tasks",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  //State of the store to props of the cmp
  return {
    currBoard: state.userBoards.currBoard,
  };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NivoBar);

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
