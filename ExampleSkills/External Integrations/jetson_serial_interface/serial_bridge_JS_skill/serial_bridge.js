function start() {
    subscribe_to_backpack_data();
}
start();

function subscribe_to_backpack_data()
{
    misty.AddReturnProperty("backpack_message", "SerialMessage");
    misty.RegisterEvent("backpack_message", "SerialMessage", 10, true);
}

function _backpack_message(data)
{	
    misty.Debug(data.AdditionalResults[0].Message);
    data = (JSON.parse(data.AdditionalResults[0].Message));
    
    if (data.stop != undefined) {
        misty.Debug("Stopping");
        misty.Stop();
    } 
    else if (data.lin != undefined && data.ang != undefined) {
        misty.Debug("Driving");
        misty.Drive(data.lin, data.ang);
    }
}

// Sending a message from Misty to Backpack
// misty.Pause(5000);
// misty.WriteSerial("This is Misty sending a string to the Serial interface on the Backpack!!");