"""
Convert old Keras 2.14 pneumonia model to Keras 3.x compatible format.

The pneumonia_model.pkl was saved with Keras 2.14 using internal pickle_utils
which no longer exists in Keras 3.x. This script:
1. Extracts the model architecture from the pickle file
2. Reconstructs it manually with Keras 3.x
3. Saves in .h5 format like Covid2.h5
"""

import zipfile
import json
import io
import pickle

print("🔧 Converting pneumonia_model.pkl to Keras 3.x format...")

# Step 1: Extract the ZIP archive from pickle file
print("\n📦 Step 1: Reading pickle file...")
with open('./Ml Models/pneumonia_model.pkl', 'rb') as f:
    # Read first bytes to find the ZIP data
    data = f.read()
    
    # Find ZIP magic bytes (PK\x03\x04)
    zip_start = data.find(b'PK\x03\x04')
    if zip_start == -1:
        print("❌ Error: Could not find ZIP data in pickle file")
        exit(1)
    
    print(f"✅ Found ZIP data at byte offset {zip_start}")
    zip_data = data[zip_start:]

# Step 2: Extract model config
print("\n📄 Step 2: Extracting model configuration...")
zip_file = zipfile.ZipFile(io.BytesIO(zip_data))

# Read metadata
with zip_file.open('metadata.json') as meta_file:
    metadata = json.load(meta_file)
    print(f"   Original Keras version: {metadata['keras_version']}")
    print(f"   Saved date: {metadata['date_saved']}")

# Read config
with zip_file.open('config.json') as config_file:
    config = json.load(config_file)
    print(f"   Model type: {config['class_name']}")
    print(f"   Number of layers: {len(config['config']['layers'])}")

# Step 3: Reconstruct model with Keras 3.x
print("\n🔨 Step 3: Reconstructing model with Keras 3.x...")
try:
    import tensorflow as tf
    from tensorflow import keras
    
    print(f"   Using TensorFlow {tf.__version__}")
    print(f"   Using Keras {keras.__version__}")
    
    # Build Sequential model from config
    model = keras.Sequential()
    
    # Add layers based on config
    for i, layer_config in enumerate(config['config']['layers']):
        layer_class = layer_config['class_name']
        layer_params = layer_config['config']
        
        print(f"   Layer {i}: {layer_class}")
        
        # Skip InputLayer - Keras 3 handles this automatically
        if layer_class == 'InputLayer':
            continue
            
        # Create layer based on type
        if layer_class == 'Conv2D':
            model.add(keras.layers.Conv2D(
                filters=layer_params['filters'],
                kernel_size=layer_params['kernel_size'],
                strides=layer_params['strides'],
                padding=layer_params['padding'],
                activation=layer_params['activation'],
                input_shape=layer_params.get('batch_input_shape', [None, 150, 150, 3])[1:]
                    if i == 1 else None  # Only first Conv2D needs input_shape
            ))
        elif layer_class == 'MaxPooling2D':
            model.add(keras.layers.MaxPooling2D(
                pool_size=layer_params['pool_size'],
                strides=layer_params['strides'],
                padding=layer_params['padding']
            ))
        elif layer_class == 'Flatten':
            model.add(keras.layers.Flatten())
        elif layer_class == 'Dense':
            model.add(keras.layers.Dense(
                units=layer_params['units'],
                activation=layer_params['activation']
            ))
        elif layer_class == 'Dropout':
            model.add(keras.layers.Dropout(rate=layer_params['rate']))
    
    print("✅ Model architecture reconstructed")
    
except Exception as e:
    print(f"❌ Error reconstructing model: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

# Step 4: Load weights from HDF5
print("\n⚖️  Step 4: Loading weights...")
try:
    # Extract weights file
    with zip_file.open('model.weights.h5') as weights_file:
        weights_data = weights_file.read()
    
    # Save temporarily
    import tempfile
    import os
    
    with tempfile.NamedTemporaryFile(suffix='.h5', delete=False) as tmp:
        tmp.write(weights_data)
        tmp_path = tmp.name
    
    try:
        # Load weights
        model.load_weights(tmp_path)
        print("✅ Weights loaded successfully")
    finally:
        os.unlink(tmp_path)
        
except Exception as e:
    print(f"⚠️  Warning: Could not load weights: {e}")
    print("   Model will be saved with random weights")
    print("   You'll need to retrain or find the original .h5 file")

# Step 5: Compile model
print("\n⚙️  Step 5: Compiling model...")
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)
print("✅ Model compiled")

# Step 6: Save in Keras 3.x format
print("\n💾 Step 6: Saving model...")
output_path = './Ml Models/pneumonia_model.h5'
model.save(output_path, save_format='h5')
print(f"✅ Model saved to: {output_path}")

# Step 7: Test loading
print("\n🧪 Step 7: Testing model load...")
try:
    test_model = keras.models.load_model(output_path, compile=False)
    print("✅ Model loads successfully!")
    print(f"\n📊 Model Summary:")
    test_model.summary()
except Exception as e:
    print(f"❌ Error loading saved model: {e}")
    exit(1)

print("\n🎉 Conversion complete!")
print(f"\n📝 Next steps:")
print(f"   1. Backup old model: mv './Ml Models/pneumonia_model.pkl' './Ml Models/pneumonia_model.pkl.backup'")
print(f"   2. The new pneumonia_model.h5 can now be loaded with: keras.models.load_model('./Ml Models/pneumonia_model.h5')")
print(f"   3. Update app.py to load .h5 instead of .pkl")