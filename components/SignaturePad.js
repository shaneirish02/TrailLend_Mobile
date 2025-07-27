import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Signature from 'react-native-signature-canvas';

const { width, height } = Dimensions.get('window');

export default function SignaturePad({ onSave, onCancel }) {
  const handleOK = (signature) => {
    onSave(signature); // base64 image string
  };

  const handleClear = (ref) => {
    ref.clearSignature();
  };

  let signRef = null;

  return (
    <View style={styles.overlay}>
      <View style={styles.signatureBox}>
        <Signature
          ref={(ref) => (signRef = ref)}
          onOK={handleOK}
          autoClear={false}
          descriptionText="Draw your signature"
          backgroundColor="#fff"
          penColor="black"
          webStyle={style}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#007bff' }]}
            onPress={() => handleClear(signRef)}
          >
            <Text style={styles.actionText}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#f8c200' }]}
            onPress={() => signRef.readSignature()}
          >
            <Text style={styles.actionText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#ff4d4d' }]}
            onPress={onCancel}
          >
            <Text style={styles.actionText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const style = `
  .m-signature-pad--footer {
    display: none;
    margin: 0px;
  }
  .m-signature-pad {
    box-shadow: none;
    border: none;
  }
`;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  signatureBox: {
    width: width * 0.9,
    height: height * 0.5,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  actionText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
