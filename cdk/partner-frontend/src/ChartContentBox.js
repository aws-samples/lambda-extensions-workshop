import { useState, useEffect } from "react";
import LineChart from "./LineChart";
import fetchMetricData from "./fetchMetricData";

export function ChartContentBox(props) {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  // Function to fetch data and update the chart data
  const fetchDataAndUpdateChart = async () => {
    try {
      const newData = await fetchMetricData();

      if (newData) {
        setLoading(false);

        console.log('new data')

        setChartData((prevChartData) => {
          // Check if there's existing chart data
          if (!prevChartData) {
            // If no previous data, return the new data as is
            return processData(newData);
          } else {
            // Merge the new data with the existing data
            return mergeData(prevChartData, processData(newData));
          }
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Function to process the fetched data and create datasets
  const processData = (data) => {
    const functionNames = [...new Set(data.map((data) => data.functionName))];

    // Prepare datasets for each distinct function
    const datasets = [];
    const sortedFunctionNames = functionNames.slice().sort(); // Sort function names alphabetically

    sortedFunctionNames.forEach((functionName, index) => {
      const dataFunction = data.filter((data) => data.functionName === functionName);
      const sortedDataFunction = dataFunction.slice().sort((a, b) => a.timeStamp.localeCompare(b.timeStamp));

      // Skip adding empty datasets
      if (sortedDataFunction.length === 0) {
        return;
      }

      // Assign predefined colors to each function
      const colors = ["#33658a", "#86BBD8", "#758E4F", "#F6AE2D", "#F26419"];
      const backgroundColor = colors[index % colors.length];

      datasets.push({
        label: functionNames[index], // Use the index for correct labeling
        data: sortedDataFunction.map((data) => ({
          x: new Date(data.timeStamp), // Use timestamp as it is
          y: data[props.metric_type],
        })),
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        borderWidth: 2,
        fill: false,
        formattedLabels: sortedDataFunction.map((data) => data.timeStamp), // Store the original timestamps in the dataset object
      });
    });

    // Sort datasets based on the timestamps (to ensure correct order)
    // datasets.sort((a, b) => a.data[0].x.localeCompare(b.data[0].x));

    // Get labels from the first dataset (if any)
    const labels = datasets.length > 0 ? datasets[0].formattedLabels : [];

    // Limit the number of labels and data points to display
    const maxLabelsToShow = 20; // Set the maximum number of labels to show
    const step = Math.ceil(labels.length / maxLabelsToShow);
    const limitedLabels = labels.filter((_, index) => index % step === 0);
    const limitedDataPoints = datasets.map((dataset) => ({
      ...dataset,
      data: dataset.data.filter((_, index) => index % step === 0),
    }));

    const chartData = {
      labels: limitedLabels,
      datasets: limitedDataPoints.map((dataset) => ({
        ...dataset,
        formattedLabels: undefined,
      })),
    };

    return chartData;
  };

  // Function to merge new data with existing data
  const mergeData = (existingData, newData) => {
    // Merge datasets based on function names
    const mergedDatasets = existingData.datasets.map((dataset) => {
      const newDataFunction = newData.datasets.find((data) => data.label === dataset.label);
      if (newDataFunction) {
        // Find the latest timestamp for the existing dataset
        const latestTimestamp = dataset.data.length > 0 ? dataset.data[dataset.data.length - 1].x : null;
        
        // Filter out any data points with timestamps that are equal to or earlier than the latest timestamp
        const filteredNewData = newDataFunction.data.filter((data) => data.x > latestTimestamp);

        // Merge and sort data points
        const mergedData = {
          ...dataset,
          data: mergeSortedData([...dataset.data, ...(filteredNewData || [])]), // Use empty array if filteredNewData is undefined
        };
        return mergedData;
      } else {
        return dataset;
      }
    });

    // Update the existing data with the merged datasets
    const mergedChartData = {
      ...existingData,
      datasets: mergedDatasets,
    };

    return mergedChartData;
  };

  // Function to merge and sort data points based on timestamps
  const mergeSortedData = (data1, data2) => {
    const mergedData = [...data1, ...(data2 || [])]; // Use empty array if data2 is undefined
    // mergedData.sort((a, b) => a.x.localeCompare(b.x));
    return mergedData;
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchDataAndUpdateChart();

    // Set up an interval to fetch data every 30 seconds
    const intervalId = setInterval(fetchDataAndUpdateChart, 30000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [props.metric_type]);

  if (loading || !chartData) {
    // Handle case where chartData is not available or while fetching data
    return <div>Loading Charts...</div>;
  }

  const options = {
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="Content-Box">
      <LineChart chartData={chartData} chartTitle={props.metric_title} chartSubtitle={props.metric_subtitle} options={options} />
    </div>
  );
}