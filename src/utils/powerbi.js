import { service, factories, models } from 'powerbi-client';
import request from 'axios';

const defaultEmbedConfiguration = {
  type: 'report',
  tokenType: models.TokenType.Embed,
  hostname: 'https://app.powerbi.cn'
};

class PowerBi {
  constructor(reportContainer, embedConfiguration = {}) {
    // 报表容器
    this.reportContainer = reportContainer;

    // 记录传入参数
    this.embedConfiguration = embedConfiguration;

    // 报表配置
    this.config = {
      ...defaultEmbedConfiguration,
      ...embedConfiguration,
      id: embedConfiguration.reportId
    };

    this.init();
  }

  init() {
    if (!this.reportContainer) throw new Error('reportContainer is required!');
    if (Object.keys(this.embedConfiguration).length === 0) { throw new Error('embedConfiguration is required!'); }
    if (!this.config.reportId) { throw new Error('embedConfiguration.reportId is required!'); }
    if (!this.config.dataSetId) { throw new Error('embedConfiguration.dataSetId is required!'); }
    if (!this.config.serviceUrl) console.warn('Default service url is ');

    // 初始化powerbi
    this.powerbi = new service.Service(
      factories.hpmFactory,
      factories.wpmpFactory,
      factories.routerFactory
    );

    // 获取后端配置
    request({
      url:
        this.config.serviceUrl ||
        '/powerbi/powerBiReport/getBiReportByReportId',
      // url:
      //   this.config.serviceUrl ||
      //   'http://bi.nearbyexpress.com/powerBiReport/getBiReportByReportId',
      method: 'post',
      data: {
        reportId: this.config.reportId,
        dataSetId: this.config.dataSetId
      }
    }).then(({ data: res }) => {
      this.config.accessToken = res.data.embedToken;
      this.config.embedUrl = res.data.embedUrl;

      // 创建报表
      this.report = this.powerbi.bootstrap(this.reportContainer, this.config);

      // 创建操作实例
      this.reportElement = this.powerbi.get(this.reportContainer);

      // 处理事件
      if (this.offEvent) this.report.off(this.offEvent);
      if (this.onCallback) this.report.on(this.onEvent, this.onCallback);
    });
  }

  // 传入事件
  on(event, callback) {
    if (!this.report) {
      this.onCallback = callback;
      this.onEvent = event;
      return;
    }

    // 解绑事件
    this.off(event);

    // 绑定事件
    this.report.on(event, callback);
  }

  // 解绑
  off(event) {
    if (!this.report) {
      this.offEvent = event;
      return;
    }
    this.report.off(event);
  }

  // 全屏
  fullscreen() {
    this.reportElement && this.reportElement.fullscreen();
  }

  // 重新载入
  reload() {
    return this.reportElement && this.reportElement.reload();
  }

  // 刷新
  refresh() {
    return this.reportElement && this.reportElement.refresh();
  }
}

export default PowerBi;
