import React, { Component } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

import Confetti from "./confetti";

type Props = ViewProps & {
  startOnLoad?: boolean;
  confettiCount?: number;
  timeout?: number;
  untilStopped?: boolean;
  colors?: string[];
};

type State = {
  confettis: { key: number }[];
  onComplete?: (() => void) | null;
};

export class ConfettiView extends Component<Props, State> {
  state: State;
  confettiIndex: number;
  shouldStop: boolean;

  constructor(props: Props) {
    super(props);
    this.state = { confettis: [], onComplete: () => {} };
    this.confettiIndex = 0;
    this.shouldStop = false;
  }

  componentDidMount() {
    if (this.props.startOnLoad) {
      this.startConfetti();
    }
  }

  componentWillUnmount() {
    this.stopConfetti();
  }

  startConfetti(onComplete?: () => void) {
    let { confettis } = this.state;
    let {
      confettiCount = 100,
      timeout = 30,
      untilStopped = false
    } = this.props;
    this.shouldStop = false;
    if (untilStopped || this.confettiIndex < confettiCount) {
      setTimeout(() => {
        if (this.shouldStop) {
          return;
        } else {
          confettis.push({ key: this.confettiIndex });
          this.confettiIndex++;
          onComplete && this.setState({ onComplete });
          this.setState({ confettis });
          this.startConfetti();
        }
      }, timeout);
    }
  }

  removeConfetti(key: number) {
    let { confettis, onComplete } = this.state;
    let { confettiCount = 100 } = this.props;
    let index = confettis.findIndex(confetti => {
      return confetti.key === key;
    });
    confettis.splice(index, 1);
    this.setState({ confettis });
    if (key === confettiCount - 1) {
      this.confettiIndex = 0;
    }
    if (
      confettis.length === 0 &&
      onComplete &&
      typeof onComplete === "function"
    ) {
      onComplete();
    }
  }

  stopConfetti() {
    this.shouldStop = true;
    this.confettiIndex = 0;
    const { onComplete } = this.state;
    if (onComplete && typeof onComplete === "function") {
      onComplete();
    }
    this.setState({ confettis: [], onComplete: null });
  }

  render() {
    let { confettis } = this.state;
    let { ...otherProps } = this.props;
    return (
      <View style={styles.container}>
        {confettis.map(confetti => {
          return (
            <Confetti
              key={confetti.key}
              index={confetti.key}
              onAnimationComplete={this.removeConfetti.bind(this, confetti.key)}
              colors={this.props.colors}
              {...otherProps}
            />
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  }
});
