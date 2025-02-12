import React, { useState } from 'react';
import { View } from 'react-native';
import PregameDialog from './PregameDialog';

const GameScreen = () => {
    const [showDialog, setShowDialog] = useState(true);

    return (
        <View style={{ flex: 1 }}>
            {showDialog && <PregameDialog onDialogComplete={() => setShowDialog(false)} />}
            {/* Your game content here */}
            
        </View>
    );
};

export default GameScreen;
