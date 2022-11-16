import 'package:flutter/material.dart';
import 'package:planner_app/Provider/TabsProvider.dart';
import 'package:provider/provider.dart';

class AppBottomNavigation extends StatelessWidget {
  const AppBottomNavigation({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<TabsProvider>(
      builder: (BuildContext context, TabsProvider tabsProvider, _) => BottomNavigationBar(
        currentIndex: tabsProvider.currentTab,
        onTap: (int index) {
          print(index);
          tabsProvider.currentTab = index;
        },
        items: const [
          BottomNavigationBarItem(
              icon: Icon(Icons.fact_check_outlined), label: 'Tarefas Pendentes'),
          BottomNavigationBarItem(
              icon: Icon(
                Icons.done,
                size: 28,
              ),
              label: 'Tarefas Concluídas')
        ],
      ),
    );
  }
}
