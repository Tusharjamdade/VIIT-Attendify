
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const screenWidth = Dimensions.get('window').width;

const AttendanceReport = () => {
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [90, 72, 95, 88, 78, 85],
      color: (opacity = 1) => `rgba(47, 128, 237, ${opacity})`,
      strokeWidth: 2
    }]
  };

  
  const pieData = [
    {
      name: 'Present',
      population: 82.6,
      color: '#2F80ED',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    },
    {
      name: 'Absent',
      population: 17.4,
      color: '#E0E0E0',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="home" size={24} color="#2F80ED" />
          <Text style={styles.headerTitle}>Attendity</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>Sakshi Choudhary</Text>
          <Text style={styles.email}>sakshichoudhary@email.com</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Check Attendance Report</Text>

        {/* Line Chart */}
        <View style={styles.chartContainer}>
          <LineChart
            data={monthlyData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(47, 128, 237, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#2F80ED'
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Overall Percentage */}
        <View style={styles.overallSection}>
          <Text style={styles.overallText}>Over all percentage: 82.6%</Text>
        </View>

        {/* Pie Chart */}
        <View style={styles.pieChartContainer}>
          <PieChart
            data={pieData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(47, 128, 237, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Classes</Text>
            <Text style={styles.statValue}>120</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Present days</Text>
            <Text style={styles.statValue}>99</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Absent days</Text>
            <Text style={styles.statValue}>21</Text>
          </View>
        </View>

        {/* Encouragement Message */}
        <Text style={styles.encouragementText}>Keep Up the Good work!</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2F80ED',
  },
  profileSection: {
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 16,
    color: '#2F80ED',
  },
  chartContainer: {
    padding: 16,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  overallSection: {
    padding: 16,
  },
  overallText: {
    fontSize: 16,
    color: '#666',
  },
  pieChartContainer: {
    alignItems: 'center',
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#F8F9FA',
    margin: 16,
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2F80ED',
  },
  encouragementText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2F80ED',
    textAlign: 'center',
    marginVertical: 24,
  },
});

export default AttendanceReport;

