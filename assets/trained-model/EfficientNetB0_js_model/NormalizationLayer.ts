import * as tf from "@tensorflow/tfjs";

export class Normalization extends tf.layers.Layer {
  static className = "Normalization";

  private mean: tf.Tensor;
  private variance: tf.Tensor;

  constructor(config: any) {
    super(config);
    console.log("Normalization layer instatiated");
    this.mean = tf.tensor(config.mean);
    this.variance = tf.tensor(config.variance);
  }

  call(inputs: tf.Tensor | tf.Tensor[]): tf.Tensor {
    const input = Array.isArray(inputs) ? inputs[0] : inputs;
    return input.sub(this.mean).div(tf.sqrt(this.variance));
  }

  getConfig() {
    const config = super.getConfig();
    return {
      ...config,
      mean: this.mean.arraySync(),
      variance: this.variance.arraySync(),
    };
  }
}

tf.serialization.registerClass(Normalization);
