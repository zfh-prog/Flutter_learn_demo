import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/iotdevice.dart';
import '../service/baseapi.dart';
import '../service/serviceapi.dart';

typedef OnValueChanged = void Function();

class LockerAuthorizationManagementAddTimeCell extends StatefulWidget {

  final LockBoxDevicePermissionTimeModel model;
  final OnValueChanged onValueChanged;

  LockerAuthorizationManagementAddTimeCell({this.model, this.onValueChanged});

  @override
  State<StatefulWidget> createState() {
    return LockerAuthorizationManagementAddTimeCellState();
  }

}

class LockerAuthorizationManagementAddTimeCellState extends State<LockerAuthorizationManagementAddTimeCell> {
  @override
  Widget build(BuildContext context) {
    
    var hourFormatter = DateFormat('HH:mm', 'en');

    var startAt = hourFormatter.format(TicksToDateTime(widget.model.StartTime));
    var endAt = hourFormatter.format(TicksToDateTime(widget.model.EndTime));
    if(endAt == "00:00") {
      endAt = "24:00";
    }
    
    var time = "";
    if(widget.model.DateType == 1) {

      for(int i = 0 ; i < widget.model.WeekDay.length ; i ++ ) {
        
        if(widget.model.WeekDay[i] == "1") {
          if(i == 0) {
            time += getLocaleCode() == "en"? "Sun ": "周日 ";
          } else if(i == 1) {
            time += getLocaleCode() == "en"? "Mon ": "周一 ";
          } else if(i == 2) {
            time += getLocaleCode() == "en"? "Tue ": "周二 ";
          } else if(i == 3) {
            time += getLocaleCode() == "en"? "Wed ": "周三 ";
          } else if(i == 4) {
            time += getLocaleCode() == "en"? "Thu ": "周四 ";
          } else if(i == 5) {
            time += getLocaleCode() == "en"? "Fri ": "周五 ";
          } else if(i == 6) {
            time += getLocaleCode() == "en"? "Sat ": "周六 ";
          }
        }
      }
    } else {
      var dayFormatter = DateFormat('d/MM/y', 'en');
      time = dayFormatter.format(TicksToDateTime(widget.model.SpecialStartDate)) + " - " + dayFormatter.format(TicksToDateTime(widget.model.SpecialEndDate));
    }

    return Container(
      padding: const EdgeInsets.all(10),
      color: Colors.white,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          Expanded(
            child: Container(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text( startAt + " - " + endAt, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
                  SizedBox(height: 5),
                  Text(time, style: TextStyle(fontSize: 14),)
                ],
              ),
            ),
          ),
          Container(
            child: new Switch(value: widget.model.EnableRule, onChanged: (bool value){
              setState(() {
                widget.model.EnableRule = value;
                if(widget.onValueChanged != null) {
                  widget.onValueChanged();
                }
              });
            }),
          )
        ],
      )
    );
  }

}