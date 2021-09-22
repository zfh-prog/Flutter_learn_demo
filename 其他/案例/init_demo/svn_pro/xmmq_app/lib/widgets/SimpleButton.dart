import 'package:flutter/material.dart';

class SimpleButton extends MaterialButton {
  final Text text;
  final bool hasOutline;

  SimpleButton({
    Key key,
    @required onPressed,
    this.hasOutline: true,
    onHighlightChanged,
    textTheme,
    textColor,
    disabledTextColor,
    color,
    disabledColor,
    focusColor,
    hoverColor,
    highlightColor,
    splashColor,
    colorBrightness,
    elevation: 0.0,
    focusElevation,
    hoverElevation,
    highlightElevation,
    disabledElevation,
    padding: EdgeInsets.zero,
    shape,
    clipBehavior,
    focusNode,
    materialTapTargetSize = MaterialTapTargetSize.shrinkWrap,
    animationDuration,
    minWidth,
    height: 20,
    this.text,
  }) : super(
          key: key,
          onPressed: onPressed,
          onHighlightChanged: onHighlightChanged,
          textTheme: textTheme,
          textColor: textColor,
          disabledTextColor: disabledTextColor,
          color: hasOutline ? Colors.white : color,
          disabledColor: disabledColor,
          focusColor: focusColor,
          hoverColor: hoverColor,
          highlightColor: highlightColor,
          splashColor: splashColor,
          colorBrightness: colorBrightness,
          elevation: elevation,
          focusElevation: focusElevation,
          hoverElevation: hoverElevation,
          highlightElevation: highlightElevation,
          disabledElevation: disabledElevation,
          padding: padding,
          shape: shape,
          clipBehavior: clipBehavior,
          focusNode: focusNode,
          materialTapTargetSize: materialTapTargetSize,
          animationDuration: animationDuration,
          minWidth: text.data.length * 20.0,
          height: height * 1.0,
          child: hasOutline
              ? Container(
                  padding: EdgeInsets.all(2),
                  margin: EdgeInsets.zero,
                  decoration: ShapeDecoration(
                    color: Colors.white,
                    shape: RoundedRectangleBorder(
                        side: BorderSide(color: Color(0xFF999999))),
                  ),
                  child: text,
                )
              : text,
        );
}
