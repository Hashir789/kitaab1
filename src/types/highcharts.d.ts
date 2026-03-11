declare module "highcharts" {
  const Highcharts: any;
  export default Highcharts;
}

declare module "highcharts/modules/*" {
  const module: any;
  export default module;
}
