import 'package:flutter/material.dart';

class ImageBanner extends StatelessWidget {
  String _assetPath = '';

  ImageBanner(String path) {
    this._assetPath = path;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints.expand(
        height: 200.0
      ),
      decoration: const BoxDecoration(color: Colors.grey),
      child: Image.asset(
        _assetPath,
        fit: BoxFit.cover,
      ),
    );
  }
}